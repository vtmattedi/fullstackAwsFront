import React from 'react';
import './forms.css';

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
                    maxWidth: '80vw',
                    color: 'white',
                }
            }> 
                <div>
                    <p style={
                        {
                            fontSize: '1.5rem',
                            textAlign: 'justify',
                            padding: '10px',
                        }
                    }>
                        This is project demonstrate a fullstack application.
                        It integrates AWS MySQL databases on a MVC pattern.
                        The front end is built with React and Bootstrap.
                        The backend is built with Node.js and Express.
                        It also implements JWT authentication with refreshtokens.
                        Take a look at the code on <a href="https://github.com/vtmattedi/fullstackAws">github</a>.
                        The project is still being developed.<br />
                        <a href="https://github.com/vtmattedi/">Github</a> || <a href="https://www.linkedin.com/in/vitor-mattedi-dev">Linkedin</a>

                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutMe;