/* External Imports */
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

/* Internal Imports */
import styles from './PolicyChoiceCard.module.css';

const PolicyChoiceCard = ({
  obj,
  handleMakePublicCheckboxChanged,
  handleUpdatePolicyChoiceClicked,
  policyChoicePublicVisibilities,
  selectedPolicyOptions,
  setSelectedPolicyOptions
}) => {
  if (obj) {
    return (
      <div className={`${styles.outer_container_size} d-flex ms-2 p-0 mb-1 justify-content-left align-items-center policychoicecard`}>
        {
          obj.options?.length > 0
          ?
            <div className={`${styles.inner_container } d-flex px-2 flex-wrap w-100`}>
              <h5 className="py-2 m-0 me-1">
                { obj.fk_Residence?.fk_Address?.street }:
              </h5>
              <Form.Select
                className={`${styles.select_size} optioninputselect`}
                aria-label="select option"
                onChange={ (e) => {
                  if (selectedPolicyOptions && obj?.fk_Residence?.id) {
                    const tempSelectedPolicyOptions = {...selectedPolicyOptions};
                    tempSelectedPolicyOptions[obj.fk_Residence.id] = e.target.value;
                    setSelectedPolicyOptions(tempSelectedPolicyOptions);
                  }
                }}
                value={
                  selectedPolicyOptions && obj?.fk_Residence?.id && selectedPolicyOptions[obj.fk_Residence.id]
                  ?
                    selectedPolicyOptions[obj.fk_Residence.id]
                  : -1
                }
              >
                {
                  obj.options.map((option, index) => {
                    return <option key={option?.id? option.id : index} value={option?.id? option.id : index}>{`${option?.option_text ? option.option_text : 'no option text exists'}`}</option>
                  })
                }
              </Form.Select>
              <Form.Check
                className="d-flex ms-2 me-1 makepubliccheckbox"
                type="checkbox"
                name="makePublicCheckbox"
                label={<b className="ms-2 me-1 colorsettings_listtext">Make address public</b>}
                onChange={ () => { handleMakePublicCheckboxChanged(obj.fk_Residence.id)} }
                checked={ policyChoicePublicVisibilities[obj.fk_Residence.id] ? policyChoicePublicVisibilities[obj.fk_Residence.id] : false }
              />
              <Button variant="primary" className="mt-1 ms-2 updatepolicychoicebutton" onClick={ () => { handleUpdatePolicyChoiceClicked(obj.fk_Residence.id, obj.id) } }>
                Update Policy Choice
              </Button>
            </div>
          :
            <div className={`${styles.other_residence_size } d-flex px-2 flex-wrap justify-content-between`}>
              <h5 className={`${styles.other_residence_font_size} py-2 m-0 me-1`}>
                { obj.fk_Residence?.fk_Address?.street }:
              </h5>
              <h5 className={`${ styles.other_residence_font_size } py-2`}>
                { obj.fk_PolicyOption?.option_text }
              </h5>
            </div>
        }

      </div>
    );
  } else {
    return ('');
  }
};

export default PolicyChoiceCard;