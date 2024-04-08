/* Internal Imports */
import styles from './LoginImage.module.css';
import logo from '../HTfulllogo.png';

const LoginImage = () => {
  return (
    <img
      alt="hometree logo"
      className={`ms-5 ${styles.size}`}
      src={ logo }
    >
    </img>
  );
};

export default LoginImage;