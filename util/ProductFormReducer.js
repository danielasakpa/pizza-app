// initialState is an object that defines the initial values for the state 
// properties when the application first loads
export const initialState = {
    file: null,
    title: null,
    desc: null,
    prices: [],
    extraOptions: [],
    extra: null,
}

// reducer is a function that takes in the current state and an action as input
// and returns a new state based on the action type
export const reducer = (state, action) => {
    // use a switch statement to determine which case to execute based on the action type
    switch (action.type) {
        case "updateFile":
            // spread the current state properties and update the file property with the action payload
            return {
                ...state,
                file: action.payload,
            };
        case "updateTitle":
            // spread the current state properties and update the title property with the action payload
            return {
                ...state,
                title: action.payload,
            };
        case "updateDesc":
            // spread the current state properties and update the desc property with the action payload
            return {
                ...state,
                desc: action.payload,
            };
        case "updatePrices":
            // update a specific element in the prices array with the value passed in the action
            state.prices[action.index] = Number(action.value)
            return state;
        case "updateExtra":
            // spread the current state properties and update the extra property 
            // with the payload of the action
            return {
                ...state,
                extra: { ...state.extra, [action.name]: action.name === "price" ? Number(action.value) : action.value },
            };
        case "updateExtraOptions":
            // spread the current state properties and update the extraOptions array
            // with the payload of the action
            return {
                ...state,
                extraOptions: [...state.extraOptions, action.payload],
            };
        case "removeExtraOptions":
            // spread the current state properties and remove the specific extra option from the extraOptions array
            return {
                ...state,
                extraOptions: [...state.extraOptions.filter(extra => extra.text != action.payload)]
            };
        // if the action type is not matched in any of the cases, return the current state
        default:
            return state;
    }
};