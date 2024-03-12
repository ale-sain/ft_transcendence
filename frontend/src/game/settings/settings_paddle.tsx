import { useState } from "react";
import GradientSet from "./BallSettings/GradientSet";
import { useGame } from "../../components/GameProvider";

export function Paddle() {
    const game = useGame(); // Utilise le contexte du jeu
    console.log("game?.paddleHeight : ", game?.paddleHeight);
    console.log("game?.paddleSpeed : ", game?.paddleSpeed);
    const [paddleSizeNumber, setPaddleSizeNumber] = useState(game?.paddleHeight ? game?.paddleHeight / 100 : 3);
    const [paddleSize, setPaddleSize] = useState(paddleSizeNumber * 10);
    const [paddleSpeed, setPaddleSpeed] = useState(game?.paddleSpeed || 30);

    const increasePaddleSize = () => {
        if (paddleSize < 100) {
            const newSize = paddleSize + 10;
            const newSizeNumber = paddleSizeNumber + 1;
            setPaddleSize(newSize);
            setPaddleSizeNumber(newSizeNumber);
            game?.setPaddleHeight(newSizeNumber * 100);
        }
    }

    const decreasePaddleSize = () => {
        if (paddleSize > 10) {
            const newSize = paddleSize - 10;
            const newSizeNumber = paddleSizeNumber - 1;
            setPaddleSize(newSize);
            setPaddleSizeNumber(newSizeNumber);
            game?.setPaddleHeight(newSizeNumber * 100);
        }
    }

    const updatePaddleSpeed = (newSpeed) => {
        setPaddleSpeed(newSpeed);
        game?.setPaddleSpeed(newSpeed);
    }

    return (
        <div className="paddle">
            <div>
                <div className="paddleSizeContainer">
                    <h2>Paddle Size</h2>
                    <div className="paddleSizeOutside">
                        <div className="paddleSizeInside" style={{ width: `${paddleSize}%` }}></div>
                    </div>
                </div>
                <div className="buttonSizePaddle">
                    <button className="lessbßutton" onClick={decreasePaddleSize}>-</button>
                    <strong>{paddleSizeNumber}</strong>
                    <button className="plusbutton" onClick={increasePaddleSize}>+</button>
                </div>
            </div>
            <GradientSet label="Movement Speed" setProgress={updatePaddleSpeed} progress={paddleSpeed} />
        </div>
    );
}
