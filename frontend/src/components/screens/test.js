import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import dlt from "../../assets/delete.svg";
import revert from "../../assets/revert.svg";
import tick from "../../assets/tick-green.svg";

function HelloWorld() {
  const [values, setValues] = useState({
    title: "",
  });
  const handleChange = (e) => {
    setInput(e.target.value);
    setValues({ ...values, [e.target.title]: [e.target.value] });
  };
  const [userdata, setUserdata] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/users")
      .then((res) => res.json())
      .then((data) => {
        setUserdata(data);
        console.log(JSON.stringify(userdata));
      })
      .catch((err) => console.log(err));
  }, []);
  const [list, setList] = useState([
    { id: 1, title: "first task" },
    { id: 2, title: "second task" },
    { id: 6, title: "new task" },
  ]);
  const [completedList, setCompletedList] = useState([
    { id: 3, title: "first task" },
    { id: 4, title: "second task" },
    { id: 5, title: "third task" },
  ]);
  const [input, setInput] = useState("");
  const [idHistory, setIdHistory] = useState(
    list.length + completedList.length
  );

  const renderItem = () => {
    return list.map((item) => (
      <ToDoLi key={item.id}>
        <ToDoLeft>
          <TickBox onClick={() => moveToComplete(item.id)}></TickBox>
          <ListContent>
            <Link
              style={{
                color: "#000",
                textDecoration: "none",
                width: "100%",
                display: "inline-block",
              }}
              to={`/singleView/${item.id}`}>
              {item.id}, {item.title}
            </Link>
          </ListContent>
        </ToDoLeft>
        <DeleteImageContainer onClick={() => removeItem(item.id)}>
          <DeleteImage src={dlt} />
        </DeleteImageContainer>
      </ToDoLi>
    ));
  };

  const renderCompletedItem = () => {
    return completedList.map((item) => (
      <ToDoLi key={item.id}>
        <ToDoLeft>
          <TickBoxCompeleted>
            <TickImage src={tick} />
          </TickBoxCompeleted>
          <ListContentCompleted>
            <Link
              style={{
                color: "#20c97b",
                textDecoration: "none",
                width: "100%",
                display: "inline-block",
              }}
              to={`/singleView/${item.id}`}>
              {item.id}, {item.title}
            </Link>
          </ListContentCompleted>
        </ToDoLeft>
        <ToDoRight>
          <RevertImageContainer onClick={() => revertItem(item.id)}>
            <RevertImage src={revert} />
          </RevertImageContainer>
          <DeleteImageContainer onClick={() => removeCompletedItem(item.id)}>
            <DeleteImage src={dlt} />
          </DeleteImageContainer>
        </ToDoRight>
      </ToDoLi>
    ));
  };
  const updateItem = (e) => {
    e.preventDefault();
    let new_item = {
      id: idHistory + 1,
      title: input,
    };
    if (input) {
      setList([...list, new_item]);
      setInput("");
      setIdHistory(idHistory + 1);
    }
  };
  const removeItem = (id) => {
    let new_list = list.filter((item) => id !== item.id);
    setList(new_list);
  };
  const removeCompletedItem = (id) => {
    let new_list = completedList.filter((item) => id !== item.id);
    setCompletedList(new_list);
  };
  const moveToComplete = (id) => {
    let new_list = list.filter((item) => item.id !== id);
    setList(new_list);
    let new_completed_list = list.find((item) => item.id === id);
    setCompletedList([...completedList, new_completed_list]);
  };
  const revertItem = (id) => {
    let new_completed_list = completedList.filter((item) => item.id !== id);
    setCompletedList(new_completed_list);
    let new_list = completedList.find((item) => item.id === id);
    setList([...list, new_list]);
  };

  return (
    <Container>
      <ToDoContainer>
        <Heading>ToDo List</Heading>

        <TopDiv>
          <SubHeading>Things to be done</SubHeading>
          <ToDoUl>
            {renderItem()}
            <ListForm>
              <Input
                type="text"
                placeholder="Type new task..."
                value={input}
                onChange={handleChange}
              />
              <Button onClick={(e) => updateItem(e)}>Add New</Button>
            </ListForm>
          </ToDoUl>
        </TopDiv>
        <BottomDiv>
          <SubHeadingB>Completed</SubHeadingB>
          <ToDoUl>{renderCompletedItem()}</ToDoUl>
        </BottomDiv>
      </ToDoContainer>
    </Container>
  );
}
export default HelloWorld;

const Container = styled.div`
  min-height: 100vh;
  max-width: 50%;
  margin: 0 auto;
  border-right: 1px solid #d1d1d1;
  border-left: 1px solid #d1d1d1;
`;
const ToDoContainer = styled.div`
  padding: 50px 150px 0;
`;
const Heading = styled.h1`
  text-align: center;
`;
const TopDiv = styled.div`
  margin-top: 40px;
`;
const SubHeading = styled.h3``;
const ToDoUl = styled.ul`
  margin-top: 20px;
`;
const ToDoLi = styled.li`
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
const ToDoLeft = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
`;
const TickBox = styled.span`
  border: 1px solid #000;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  display: inline-block;
  margin-right: 8px;
  cursor: pointer;
`;
const TickBoxCompeleted = styled(TickBox)`
  border: 1px solid #20c97b;
`;
const TickImage = styled.img`
  margin-top: 4px;
  margin-left: 3px;
  display: block;
  width: 65%;
`;
const ListContent = styled.span`
  width: 100%;
`;
const ListContentCompleted = styled(ListContent)`
  color: #20c97b;
`;
const ToDoRight = styled.div`
  display: flex;
  align-items: center;
`;
const DeleteImageContainer = styled.div`
  width: 15px;
  cursor: pointer;
`;
const DeleteImage = styled.img`
  display: block;
  width: 100%;
`;
const ListForm = styled.form`
  position: relative;
  display: flex;
  z-index: 1;

  &::before {
    content: "";
    background-image: url(${require("../../assets/plus.svg").default});
    height: 15px;
    width: 15px;
    position: absolute;
    display: block;
    left: 10px;
    top: 0;
    bottom: 0;
    margin: auto 0;
  }
`;
const Input = styled.input`
  width: 100%;
  padding: 10px 30px;
  font-size: 16px;
`;
const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 0 6px 6px 0;
  color: #fff;
  background-color: #151a58;
  position: absolute;
  top: 0;
  right: -3px;
  cursor: pointer;
`;
const BottomDiv = styled.div`
  margin-top: 20px;
`;
const SubHeadingB = styled.h3``;
const RevertImageContainer = styled.div`
  width: 15px;
  margin-right: 15px;
  cursor: pointer;
`;
const RevertImage = styled.img`
  display: block;
  width: 100%;
`;
