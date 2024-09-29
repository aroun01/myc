# python3 shTorSearchNode.py
import requests
import pandas as pd
import os
import ast


queryDepth = 500

CountRawTorEntryNodes = 50
CountRawTorExitNodes = 50

# Получаем данные по адресу и сериализуем их
response = requests.get('https://onionoo.torproject.org/details?limit='+str(queryDepth))
data = response.json()

# Превращаем данные в датасет
df = pd.DataFrame(data['relays'])

# Удаление строк, где значение столбца 'running' равно False
df = df[df['running'] == True]

# Список полей для удаления
listFieldsForDelete = ['nickname','fingerprint','last_seen','last_changed_address_or_port','first_seen','running','country','country_name','as','as_name','consensus_weight', 'verified_host_names', 'last_restarted', 'bandwidth_burst', 'observed_bandwidth', 'advertised_bandwidth','exit_policy', 'exit_policy_summary', 'contact', 'platform', 'version', 'version_status', 'effective_family', 'consensus_weight_fraction', 'middle_probability', 'recommended_version', 'measured', 'unverified_host_names', 'overload_general_timestamp', 'exit_policy_v6_summary', 'exit_addresses']

# Удаление полей из датасета
df = df.drop(columns=listFieldsForDelete)
def check_flags(row):
    return ('Fast' in row) and ('Running' in row) and (('Exit' in row) or ('Guard' in row)) and ('Stable' in row)

# Фильтрация строк с помощью функции check_flags
df = df[df['flags'].apply(check_flags)]

df = df.sort_values(by='bandwidth_rate', ascending=False)
df.reset_index(drop=True, inplace=True)
# Функция для извлечения IP-адреса и порта из строки
def extract_ip_port(row):
    addresses = ast.literal_eval(row)  # Преобразование строки в список
    # print('addresses: ', addresses)


df['IP'] = ''
df['Port'] = ''

for i, row in df.iterrows():
    temp_ = row['or_addresses'][0].split(":") 
    IP = temp_[0]
    Port = temp_[1]
    df['IP'][i] = IP
    df['Port'][i] = Port
    # print('IP: ', IP, '  Port: ', Port)

del(df['or_addresses'])

TorEntryNodes = []
TorExitNodes = []

itemEntryNodes = 0
rows_to_delete = []
for i, row in df.iterrows():
    print('i: ', i)
    if 'Guard' in row['flags']:
        TorEntryNodes.append({'IP': row['IP'], 'Port': row['Port']})
        rows_to_delete.append(i)
        itemEntryNodes+=1
    if itemEntryNodes > CountRawTorEntryNodes:
        break

TorEntryNodes = pd.DataFrame(TorEntryNodes)

df = df.drop(rows_to_delete)
df.reset_index(drop=True, inplace=True)

itemExitNodes = 0
rows_to_delete = []
for i, row in df.iterrows():
    if 'Exit' in row['flags']:
        TorExitNodes.append({'IP': row['IP'], 'Port': row['Port']})
        rows_to_delete.append(i)
        itemExitNodes+=1
    if itemExitNodes > CountRawTorExitNodes:
        break

TorExitNodes = pd.DataFrame(TorExitNodes)

df = df.drop(rows_to_delete)
df.reset_index(drop=True, inplace=True)


print("----------TorEntryNodes-----------")
print(TorEntryNodes)
print("----------TorExitNodes-----------")
print(TorExitNodes)



json_file = 'RawTorEntryNodes.json'
if os.path.isfile(json_file):
    os.remove(json_file)
if not TorEntryNodes.empty:
    TorEntryNodes.to_json(json_file, orient='records')
else:
    print("RawTorEntryNodes: нет данных, удовлетворяющих заданным условиям.")


json_file = 'RawTorExitNodes.json'
if os.path.isfile(json_file):
    os.remove(json_file)
if not TorExitNodes.empty:
    TorExitNodes.to_json(json_file, orient='records')
else:
    print("RawTorExitNodes: нет данных, удовлетворяющих заданным условиям.")


# csv_file = 'filtered_tor_relays.csv'
# if os.path.isfile(csv_file):
#     os.remove(csv_file)
# if not df.empty:
#     df.to_csv(csv_file, index=False)
# else:
#     print("Нет данных, удовлетворяющих заданным условиям.")


