// initialState is an object that defines the initial values for the state 
// properties when the application first loads
export const initialState = {
    customer: "",
    email: "",
    address: "",
    customerError: "",
    emailError: "",
};

// regular expression to validate the customer input
const customerRegex = /^[a-z0-9_-]{3,15}$/;

// regular expression to validate the email input
const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;

// reducer is a function that takes in the current state and an action as input
// and returns a new state based on the action type
export const reducer = (state, action) => {
    // use a switch statement to determine which case to execute based on the action type
    switch (action.type) {
        case "updateCustomer":
            // spread the current state properties and update the customer property with the action payload
            return {
                ...state,
                customer: action.payload,
            };
        case "validateCustomer":
            // validate the customer input using customerRegex regular expression 
            // and update the customerError property with an error message if the validation fails
            return {
                ...state,
                customerError: customerRegex.test(state.customer) ? null : "Customer must be alphabetic",
            };
        case "updateEmail":
            // spread the current state properties and update the email property with the action payload
            return {
                ...state,
                email: action.payload,
            };
        case "validateEmail":
            // validate the email input using emailRegex regular expression 
            // and update the emailError property with an error message if the validation fails
            return {
                ...state,
                emailError: emailRegex.test(state.email) ? null : "Please enter a valid email address",
            };
        case "updateAddress":
            // spread the current state properties and update the address property with the action payload
            return {
                ...state,
                address: action.payload,
            };
        // if the action type is not matched in any of the cases, return the current state
        default:
            return state;
    }
};