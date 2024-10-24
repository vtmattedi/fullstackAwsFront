import React from 'react';
import '../Css/forms.css';

const AboutMe: React.FC = () => {
    return (
        <div className="outter-input-div">
            <div style={
                {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px',
                    maxWidth: '500px',
                    color: 'white',
                }
            }>
                <div>
                    <div style={
                        {
                            fontSize: '1rem',
                            textAlign: 'justify',
                            padding: '10px',
                        }
                    }>
                        <div style={{ textAlign: 'center' }}>
                            <a style={{
                                color: 'white',
                                padding: '5px',
                            }} href="https://github.com/vtmattedi/" className='bi bi-github'>/vtmattedi</a>  <a style={{
                                color: 'white',
                                padding: '5px',
                            }}href="https://www.linkedin.com/in/vitor-mattedi-dev" className='bi bi-linkedin'>/vitor-mattedi-dev</a>
                        </div>
                        <hr />
                        This project demonstrates a fullstack application.
                        It integrates AWS MySQL databases on a MVC pattern.
                        The front-end is built with React and Bootstrap.
                        The back-end is built with Node.js and Express.
                        It also implements JWT authentication with refreshtokens and support multiple sessions with a logout from all devices feature.
                        Take a look at the code on <a href="https://github.com/vtmattedi/fullstackAws">github</a>.
                        The app is also responsive, try it on your phone.
                        You dont need to use a real email, just type any mock email and it will work.
                        Part of the demonstration is to have the email be visible to other users.
                        Do not use sensitive information. (Demo:
                        login: test@test.com, password: test1234)

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutMe;