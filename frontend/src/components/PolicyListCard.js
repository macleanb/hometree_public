/* External Imports */
import ListGroup from 'react-bootstrap/ListGroup';

/* Internal Imports */
import styles from './PolicyListCard.module.css';

const PolicyListCard = ({
  handleObjClicked,
  headlineFieldName,
  label,
  obj
}) =>

  //////////////
  /*  Render  */
  //////////////
  
{
  return (
    <ListGroup.Item className={`${styles.outer_container_size} p-0 policy-list-card`} action onClick={ () => handleObjClicked(obj) } variant="light">
      <div className="d-flex p-0 pb-2 flex-wrap justify-content-between colorsettings_bodybackground colorsettings_bodybackgroundhover">
        {
          obj.image
          ?
            <div className="d-flex align-items-center">
              <img src={ obj.image } width="100" height="100" alt={ label }/>
            </div>
          : ''
        }

        
        <div className="d-flex w-100 flex-column justify-content-center ms-1">
          <h5 align="left" className={`${styles.font_size} mt-2 mb-1 colorsettings_listtext`}><b>{ obj[ headlineFieldName ] }</b></h5>
          {
            obj.effective_date
            ?
              <p align="left" className="mt-1 mb-1">{ new Date(obj.effective_date).toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"}) }</p>
            : ''
          }
        </div>
      </div>
    </ListGroup.Item>
  );
};

export default PolicyListCard;