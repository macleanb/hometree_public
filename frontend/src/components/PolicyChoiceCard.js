/* External Imports */
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

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
      <div className="d-flex ms-2 p-0 mb-1 justify-content-left align-items-center policychoicecard">
        <span className="me-5 align-middle">
          { obj.fk_Residence?.fk_Address?.street }:
        </span>
        {
          obj.options?.length > 0
          ?
            <div className="d-flex optioninputdiv">
              <Form.Select
                className="mt-1 ms-2 text-gray-700 optioninputselect"
                aria-label="select option to remove"
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
            <span className="ms-2">
              { obj.fk_PolicyOption?.option_text }
            </span>
        }

      </div>
    );
  } else {
    return ('');
  }
};

export default PolicyChoiceCard;