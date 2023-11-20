import { useEffect, useState, useRef } from "react";
import { useCardContext } from "../hooks/useCardContext";
import { shuffleArray } from "../helpers/shuffleArray";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ModalBody from "react-bootstrap/esm/ModalBody";

const Test = () => {
  const { cards } = useCardContext();
  const [testAnswer, setTestAnswer] = useState('');
  const [testCard, setTestCard] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false);

  
  useEffect(() => {

     shuffleArray(cards);
    setTestCard(cards[0])    
  }, [cards]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowAnswer(true);
};

const handleNext = () => {
    
    cards.shift()
    
    setTestCard(cards[0])
    setShowAnswer(false)
 
  };

  //const handleShow = () => setShow(true);

  return (
    <div className="container">
           
      <div>
        <h2>{testCard && testCard.question}</h2>
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Answer</Form.Label>
          <Form.Control type="text" placeholder="type answer" 
          onChange={(e) => setTestAnswer(e.target.value)}
          value={testAnswer}/>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <Modal show={showAnswer}>
        {testCard && testCard.answer}
        <Button variant="primary" onClick={handleNext} disabled={cards.length <= 1}>
          Next
        </Button>
      {testCard && testCard.answer === testAnswer && 
      <h3>Correct</h3>}

{testCard && testCard.answer !== testAnswer && 
      <h3>Inorrect</h3>}
      </Modal>
    
    </div>
  );
};

export default Test;
