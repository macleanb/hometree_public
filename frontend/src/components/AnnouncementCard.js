/* External Imports */
import Card from 'react-bootstrap/Card';

/* Internal Imports */
import getURL_BackendImage from '../utils/getURL_BackendImage';
import styles from './AnnouncementCard.module.css';

/* For displaying detailed information for a given record object. */
const AnnouncementCard = ({ keyValue, obj }) => {
  return (
      <Card className="border-0 heightsettings_announcementcard">
        <Card.Header as="h5" className="text-right" style={{ color: 'white', backgroundColor: "#427b01"}}>{ obj?.created_datetime ? new Date(obj.created_datetime.split('T')[0]).toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"}) : '' }</Card.Header>
        <Card.Body className="d-flex justify-content-around p-3 colorsettings_borders heightsettings_announcementcard cardbody">
            <div>
              <Card.Title className={styles.title_text}>{ obj?.title ? obj.title : '' }</Card.Title>
              {
                obj?.image
                ?
                  <Card.Img className={styles.image_size} src={ obj?.image ? getURL_BackendImage(obj.image) : ''} alt="announcement summary information"/>
                : ''
              }
              <Card.Text className={`${styles.text_clear} announcementcardtext`}>
                { obj?.bodytext ? obj.bodytext : '' }
              </Card.Text>
            </div>
        </Card.Body>
      </Card>
  );
};

export default AnnouncementCard;