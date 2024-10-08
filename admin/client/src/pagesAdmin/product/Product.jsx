import { CalendarToday, LocationOn, MailOutline, PermIdentity, PhoneAndroid, Publish } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import './product.scss'

const Product = () => {
  return (
    <div className='userPage'>
      <div className="userContainer">
        <div className="show">
          <div className="top">
            <img src="https://upload.wikimedia.org/wikipedia/pt/f/f2/Arya_stark_s7.jpg" alt="profile" />
            <div className="title">
              <span className="username">Arya Stark</span>
              <span className="userTitle">Software Engineer</span>
            </div>
          </div>
          <div className="bottom">
            <span className="title">Account Details</span>
            <div className="info">
              <PermIdentity className='icon' />
              <span className="infoTitle">aryastark56</span>
            </div>
            <div className="info">
              <CalendarToday className='icon' />
              <span className="infoTitle">15/05/2003</span>
            </div>

            <span className="title">Contact Details</span>

            <div className="info">
              <PhoneAndroid className='icon' />
              <span className="infoTitle">+55 98931-5013</span>
            </div>
            <div className="info">
              <MailOutline className='icon' />
              <span className="infoTitle">erickkhogarth@gmail.com</span>
            </div>
            <div className="info">
              <LocationOn className='icon' />
              <span className="infoTitle">Ceará | Brasil</span>
            </div>
          </div>
        </div>
        <div className="update">
          <span className="title">Information</span>
          <form>
            <div className="left">
              <div className="updateItem">
                <label>Full Name</label>
                <input readOnly type="text" placeholder='Arya Stark'/>
              </div>
              <div className="updateItem">
                <label>E-mail</label>
                <input readOnly type="text" placeholder='erickkhogarth@gmail.com'/>
              </div>
              <div className="updateItem">
                <label>Phone</label>
                <input readOnly type="text" placeholder='+55 98931-5013'/>
              </div>
            </div>
            <div className="right">
              <button>На рассмотрении</button>
              <button>Готово</button> 
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Product