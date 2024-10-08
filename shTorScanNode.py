# python3 shTorScanNode.py

import json
import nmap
import time
import os

WaitingTimeResponseFromNodeSeconds = 20
CountComplited = 4

def scan_nodes(nodes_file, output_file, CountComplited, timeout_sec):
    if os.path.isfile(output_file):
        os.remove(output_file)

    nm = nmap.PortScanner()
    ready_nodes = []

    try:
        with open(nodes_file, 'r') as file:
            nodes = json.load(file)

            print("---  len(nodes)  ---")
            print(len(nodes))

            for node in nodes:
                ip = node['IP']
                port = node['Port']
                try:
                    start_time = time.time()  # Запускаем таймер
                    result = nm.scan(ip, port, timeout=timeout_sec)  # Устанавливаем лимит времени ожидания ответа
                    end_time = time.time()  # Завершаем таймер
                    elapsed_time = end_time - start_time  # Вычисляем прошедшее время взаимодействия с нодой
                    if ip in result['scan'] and 'tcp' in result['scan'][ip]:
                        port_info = result['scan'][ip]['tcp'][int(port)]
                        status = port_info['state']
                    else:
                        status = "Unknown"  # Указываем статус как "Unknown", если данные для IP-адреса отсутствуют
                    print(f"Node: {ip}:{port} - Status: {status} - Response Time: {elapsed_time:.3f} seconds")
                    if status == 'open':
                        ready_nodes.append({'IP': ip, 'Port': port, 'ResponseTime': elapsed_time})
                except nmap.nmap.PortScannerTimeout:
                    print(f"Node: {ip}:{port} - Timeout Exceeded - Response Time: {timeout_sec} seconds")

                if len(ready_nodes) > CountComplited:
                    print(output_file + " Complited!")
                    break

    except FileNotFoundError:
        print("File not found. Please check the file path.")

    print("---  len(ready_nodes)  ---")
    print(len(ready_nodes))

    if len(ready_nodes) > 0:
        with open(output_file, 'w') as outfile:
            json.dump(ready_nodes, outfile, indent=4)
    else:
        print(output_file + ": нет данных, удовлетворяющих заданным условиям.")


scan_nodes('RawTorEntryNodes.json', 'ReadyTorEntryNodes.json', CountComplited, timeout_sec=WaitingTimeResponseFromNodeSeconds)
scan_nodes('RawTorExitNodes.json', 'ReadyTorExitNodes.json', CountComplited, timeout_sec=WaitingTimeResponseFromNodeSeconds)
