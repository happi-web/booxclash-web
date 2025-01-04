import { Link } from 'react-router-dom';
function MainContainer(){
  return (
        <div className="container-content">
            <div className="box-container">
                <div className="boxes">
                    <img src="/images/learn.jpg" alt="Kids learning"/>
                    <div className="boxes-items">
                        <h3>Discover the Wonders of Science and Math!</h3>
                        <p>Explore our easy-to-follow tutorials and interactive readings
                        designed for students of all levels.
                            Whether you're diving into the mysteries of physics, 
                            mastering the art of algebra, or exploring the periodic 
                            table, our learning resources make concepts come to 
                            life with:</p>
                        <ul>
                        <li>Step-by-step guides.</li>
                        <li>Fun facts and real-world applications.</li>
                        <li>Quizzes to test your understanding.</li>
                        </ul>
                        <button id="learn"><Link to="/learn">Learn</Link></button>
                    </div>
                </div>
                <div className="boxes">  
                    <div className="boxes-items">
                        <h3>Learn While Having Fun!</h3>
                        <p>Turn challenges into excitement with our 
                        educational games! Boost your math and science
                        skills in a competitive and entertaining way:</p>
                        <ul>
                        <li><strong>Knockout Games:</strong>Battle through rounds by answering quickfire questions.</li> 
                        <li><strong>Logic Puzzles:</strong>Sharpen your problem-solving skills.</li>
                        <li><strong>Simulations:</strong>Experiment with virtual labs and solve real-world problems.</li>
                        <li><strong>Trivia Challenges:</strong>Test your knowledge in fun, timed quizzes.</li>
                        </ul>
                        <button id="learn"><Link to="/play">Explore Our Games</Link></button>
                    </div>
                    <img src="/images/games.jpg" alt="Kids learning"/>
                </div>
            </div>
            <div className="box-container">
                <div className="boxes">
                    <div className="boxes-items">
                    <h3>Connect, Collaborate, and Create!</h3>
                    <p>Learning is better together! Join the community and build meaningful connections:</p>
                    <ul>
                        <li>Create or join <strong>Chat Rooms</strong> for collaborative learning.</li>
                        <li>Chat with friends or classmates while solving problems.</li>
                        <li>Share notes, insights, and resources.</li>
                        <li>Participate in weekly challenges and group projects to grow as a team.</li>
                    </ul>
                    <button id="learn"><Link to="/engage">Chat With A Friend</Link></button>
                    </div>
                    <img src="./images/connect.jpg" alt="Kids learning"/>
                </div>
                <div className="boxes">
                    <img src="./images/support.jpg" alt="Kids learning"/>
                    <div className="boxes-items">
                    <h3>We're Here for You Every Step of the Way!</h3>
                    <p>We believe in supporting every learner, teacher, and parent. Get the help you need:</p>
                    <ul>
                        <li><strong>For Students:</strong> Struggling with a concept? Access guides, ask experts, or replay lessons.</li>
                        <li><strong>For Teachers:</strong> Find tools to complement your classroom teaching and track progress.</li>
                        <li><strong>For Parents:</strong> Stay involved in your child’s education with activity reports and resources.</li> 
                    </ul>
                    <button id="learn"><Link to="/support">Call Us Now</Link></button>
                    </div>
                </div>
            </div>
        </div>
  )
}
export default MainContainer