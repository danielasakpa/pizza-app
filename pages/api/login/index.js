import cookie from "cookie";

const handler = (req, res) => {
    if (req.method === "POST") { // check if method is POST
        const { username, password } = req.body; // destructuring the request body
        // checking if the username and password match the predefined admin credentials
        if (
            username === process.env.ADMIN_USERNAME &&
            password === process.env.ADMIN_PASSWORD
        ) {
            // if the credentials match, set a cookie with a token and a maxAge of 3 days
            res.setHeader(
                "Set-Cookie",
                cookie.serialize("token", process.env.TOKEN, {
                    maxAge: 60 * 60 * 24 * 3, // maximum age of 3 days
                    sameSite: "strict",
                    path: "/",
                })
            );
            res.status(200).json("Succesfull"); // returns success if credentials match
        } else {
            res.status(400).json("Wrong Credentials!"); // returns wrong credentials if the credentials don't match
        }
    }
};

export default handler;