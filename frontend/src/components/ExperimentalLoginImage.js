/* Internal Imports */
import styles from './ExperimentalLoginImage.module.css';
import logo from '../HTfulllogo.png';

const ExperimentalLoginImage = () => {
  return (
    // <img
    //   alt="hometree logo"
    //   className="ms-5"
    //   height={750}
    //   src={ logo }
    //   width={1000}
    // >
    <img
      alt="hometree logo"
      className={`ms-5 ${styles.size}`}
      src={ logo }
    >
    </img>
  );
};

export default ExperimentalLoginImage;