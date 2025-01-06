import { Link } from 'react-router-dom';
function MainContainer(){
  return (
        <div className="container-content">
            <div className="box-container">
                <div className="boxes">
                    <img src="/booxclash-web/images/learn.jpg" alt="Kids learning"/>
                    <div className="boxes-items">
                        <button id="learn"><Link to="/learn">Learn Now</Link></button>
                    </div>
                </div>
                <div className="boxes"> 
                    <img src="/booxclash-web/images/games.jpg" alt="Kids learning"/> 
                    <div className="boxes-items">
                        <button id="learn"><Link to="/play">Explore Our Games</Link></button>
                    </div>
                    
                </div>
            </div>
            <div className="box-container">
                <div className="boxes">
                    <img src="/booxclash-web/images/connect.jpg" alt="Kids learning"/>
                    <div className="boxes-items">
                    <button id="learn"><Link to="/chat">Chat With A Friend</Link></button>
                    </div>
                    
                </div>
                <div className="boxes">
                    <img src="/booxclash-web/images/support.jpg" alt="Kids learning"/>
                    <div className="boxes-items">
                    <button id="learn"><Link to="/support">Call Us Now</Link></button>
                    </div>
                </div>
            </div>
        </div>
  )
}
export default MainContainer