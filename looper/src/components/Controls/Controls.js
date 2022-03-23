import { BsFillPlayFill, BsFillStopFill } from 'react-icons/bs';
import { TiArrowLoop } from 'react-icons/ti';

function Controls(props) {
    return (
        <div className='controls'>

            {/* play button */}

            <button className='controls__button' onClick={props.playAll}>
                <BsFillPlayFill className='controls__symbol' />
            </button>

            {/* stop button */}

            <button className='controls__button' onClick={props.stopAll}>
                <BsFillStopFill className='controls__symbol' />
            </button>

            {/* loop button */}

            <button className={`controls__button ${props.loop ? 'controls__button_on' : ''}`} onClick={props.toggleLoop}>
                <TiArrowLoop className='controls__symbol' />
            </button>
        </div>
    );
}

export default Controls;