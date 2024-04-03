/* External Imports */
import Card from 'react-bootstrap/Card';

/* For displaying detailed information for a given record object. */
const AnnouncementCard = ({ keyValue, obj }) => {
  return (
      <Card className="border-0 heightsettings_announcementcard widthsettings_announcementsdisplaytilelarge">
        <Card.Header as="h5" className="text-right" style={{ color: 'white', backgroundColor: "#427b01"}}>{ obj?.created_datetime ? new Date(obj.created_datetime.split('T')[0]).toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"}) : '' }</Card.Header>
        <Card.Body className="d-flex justify-content-around p-0 colorsettings_borders heightsettings_announcementcard cardbody">
          <div className="d-flex flex-fill justify-content-around heightsettings_imageandbodycontainer imageandbodycontainer">
            {
              obj?.image
              ?
                <div className="heightsettings_announcementcardimagecontainer widthsettings_announcementcardimagecontainer announcementcardimagecontainer">
                    <Card.Img src={ obj?.image ? obj.image : ''} alt="announcement summary information" className="heightsettings_announcementcardimage widthsettings_announcementcardimage"/>
                </div>
              : ''
            }
            <div className="heightsettings_announcementcardtitletext announcementcardtitletext">
              <Card.Title>{ obj?.title ? obj.title : '' }</Card.Title>
              <Card.Text className="announcementcardtext">
                { obj?.bodytext ? obj.bodytext : '' }
              </Card.Text>
            </div>
          </div>
        </Card.Body>
      </Card>
  );
};

export default AnnouncementCard;