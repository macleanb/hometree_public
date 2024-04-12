/* External Imports */
import 'bootstrap/dist/css/bootstrap.min.css';
import Col from 'react-bootstrap/Col';
import { useContext, useEffect, useState} from 'react';
import React from 'react';
import Row from 'react-bootstrap/Row';

/* Internal Imports */
import AuthContext from '../contexts/AuthProvider';
import constants from '../constants';
import PolicyChoiceCard from './PolicyChoiceCard';
import styles from './ResidencePolicyChoices.module.css';

/* This component takes in residencePolicyChoice data and displays it in 
   sorted order.  It sends click events back to the parent component
   to be handled there. */
const ResidencePolicyChoices = (
  {
    currentCommunityPolicy,
    handleMakePublicCheckboxChanged,
    handleUpdatePolicyChoiceClicked,
    policyChoicePublicVisibilities,
    residencePolicyChoicesDataArr,
    selectedPolicyData,
    selectedPolicyOptions,
    setPolicyChoicePublicVisibilities,
    setSelectedPolicyOptions
  }) => 
{
  //////////////////
  /* Declarations */
  //////////////////
  const { auth } = useContext(AuthContext);
  const [ residencePolicyChoicesDisplayArr, setResidencePolicyChoicesDisplayArr ] = useState(); // sorted

  //////////////////////
  /* Helper Functions */
  //////////////////////

  /* Sorts the residencePolicyChoicesDisplayArr, by street address */
  const setSortedResidencePolicyChoicesDisplayArr = () => {
    if (residencePolicyChoicesDataArr) {
      // const sortedArr = residencePolicyChoicesDataArr.sort(function (a, b) {
      //   /* Compare just the street numbers */
      //   const reLeadingNumbersA = /^[0-9]+/;
      //   const reLeadingNumbersB = /^[0-9]+/;

      //   let matchA = null;
      //   let matchB = null;
      //   if (a.fk_Residence.fk_Address.street && b.fk_Residence.fk_Address.street) {
      //     matchA = a.fk_Residence.fk_Address.street.match(reLeadingNumbersA);
      //     matchB = b.fk_Residence.fk_Address.street.match(reLeadingNumbersB);
      //   }

      //   if (matchA && matchB) {
      //     const intA = parseInt(matchA);
      //     const intB = parseInt(matchB);
  
      //     if (intA < intB) {
      //       return -1;
      //     }
  
      //     if (intB < intA) {
      //       return 1;
      //     }
      //   } else if (matchA) {
      //     return -1;
      //   } else if (matchB) {
      //     return 1;
      //   }

      //   return 1;
      // });
    
      // setResidencePolicyChoicesDisplayArr(sortedArr);

      /* Leave the sorting order provided by PolicyDashboard */
      setResidencePolicyChoicesDisplayArr(residencePolicyChoicesDataArr);
    }
  }

  ///////////////////
  /*  Use Effects  */
  ///////////////////

  /* Set residencePolicyChoicesDisplayArr once residencePolicyChoicesData is loaded */
  useEffect(() => {
    if ( residencePolicyChoicesDataArr?.length > 0) {
      setSortedResidencePolicyChoicesDisplayArr();
    }
  }, [residencePolicyChoicesDataArr]);

  //////////////
  /*  Render  */
  //////////////

  if (auth && auth.status && auth.status === constants.STATUS_AUTHENTICATED) {
    return (
      <section className={`${ styles.outer_container_size } d-flex flex-column justify-content-start p-0 colorsettings_bodybackground heightsettings_residencepolicychoicescontainer residencepolicychoicescontainer`}>
        <h1 className="colorsettings_bodybackground colorsettings_bodyheaders"><u>Policy Choices (by residence)</u></h1>
        <h2
          className={`${styles.question_font_size} mt-2 mb-2`}
        >
            <i>{ selectedPolicyData?.question ? selectedPolicyData.question : '' }</i>
        </h2>
        <h3
          className={`${styles.statement_font_size} mt-2 mb-5 text-primary`}
        >
            <b>
              Current community policy: { currentCommunityPolicy?.policyOption ? currentCommunityPolicy.policyOption.option_text : 'No current policy' } { currentCommunityPolicy?.percentage ? '(' + currentCommunityPolicy.percentage + '% of votes)' : ''}
            </b>
        </h3>
        {/* <div className="d-flex m-0 p-2 justify-content-center colorsettings_bodybackground widthsettings_residencepolicychoicetile residencepolicychoicetile"> */}
        <div className="d-flex m-0 p-2 justify-content-center colorsettings_bodybackground">
          {
            residencePolicyChoicesDisplayArr?.length > 0
            ?
              <Col className={`${styles.col_size}`}>
                {residencePolicyChoicesDisplayArr.map((obj, index) => (
                  <Row key={ index } className="pb-2 mb-3 justify-content-center border-bottom border-secondary w-100">
                    <PolicyChoiceCard
                      obj={ obj }
                      handleMakePublicCheckboxChanged={ handleMakePublicCheckboxChanged }
                      handleUpdatePolicyChoiceClicked={ handleUpdatePolicyChoiceClicked }
                      policyChoicePublicVisibilities={ policyChoicePublicVisibilities }
                      selectedPolicyOptions={ selectedPolicyOptions }
                      setPolicyChoicePublicVisibilities={ setPolicyChoicePublicVisibilities }
                      setSelectedPolicyOptions={ setSelectedPolicyOptions }
                    />
                  </Row>
                ))}
              </Col>
            : ''
          }
        </div>
      </section>
    );
  } else {
    return (
      <div>Loading page...</div>
    );
  }
}

export default ResidencePolicyChoices;

