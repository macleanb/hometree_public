const emptyPolicyData = () => {
  return {
    statement: '',
    question: '',
    description: '',
    effective_date: '',
    options: null,
    option_text: '',
    image: null,
    imageFileName: '',
    deleteExistingImage: false,
    backendImageExists: false,
  }
};

export default emptyPolicyData;