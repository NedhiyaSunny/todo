import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import dlt from "../../assets/delete.svg";
import revert from "../../assets/revert.svg";
import tick from "../../assets/tick-green.svg";
import axios from "axios";

function HelloWorld() {
  const [values, setValues] = useState("");
  const handleChange = (e) => {
    setInput(e.target.value);
    setValues(e.target.value);
  };
  const [tasks, setTasks] = useState([]);
  const [completed_tasks, setCompleted_tasks] = useState([]);
  const [isloading, setIsloading] = useState(true);
  const [userId, setUserId] = useState();
  const [count, setCount] = useState();
  const [completed_count, setCompleted_count] = useState();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    setUserId(userId);
    fetchUpdatedTasks(userId);
    fetchCompletedTasks(userId);
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
    return tasks.map((item) => (
      <ToDoLi key={item.id}>
        <ToDoLeft>
          <TickBox onClick={() => moveToComplete(item.id)}> </TickBox>
          <ListContent>
            <LinkTag to={`/singleView/${item.id}/${0}`}>{item.title}</LinkTag>
          </ListContent>
        </ToDoLeft>
        <DeleteImageContainer onClick={() => removeItem(item.id)}>
          <DeleteImage src={dlt} />
        </DeleteImageContainer>
      </ToDoLi>
    ));
  };

  const renderCompletedItem = () => {
    return completed_tasks.map((item) => (
      <ToDoLi key={item.id}>
        <ToDoLeft>
          <TickBoxCompeleted>
            <TickImage src={tick} />
          </TickBoxCompeleted>
          <ListContentCompleted>
            <CompletedLinkTag to={`/singleView/${item.id}/${1}`}>
              {item.title}
            </CompletedLinkTag>
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
  // functions for reuse
  const fetchUpdatedTasks = (userId) => {
    axios
      .get(`http://localhost:8081/tasks`, { params: { userId: userId } })
      .then((response) => {
        setTasks(response.data);
        setCount(response.data.length);
      })
      .catch((error) => console.error("Error fetching new item", error));
  };

  const fetchCompletedTasks = (userId) => {
    axios
      .get("http://localhost:8081/completed_tasks", {
        params: { userId: userId },
      })
      .then((response) => {
        setCompleted_tasks(response.data);
        setCompleted_count(response.data.length);
        setIsloading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const removerFromTasks = (id) => {
    axios
      .post("http://localhost:8081/remove", { id: id })
      .then((res) => {
        fetchUpdatedTasks(userId);
      })
      .catch((err) => {
        console.log(
          "error while fetching data after removing from uncompleted task",
          err
        );
      });
  };
  const removeFromCompleted = (id) => {
    axios
      .post("http://localhost:8081/completed_remove", { id: id })
      .then((res) => {
        fetchCompletedTasks(userId);
      })
      .catch((err) => {
        console.log(
          "error while fetching data after removing from uncompleted task",
          err
        );
      });
  };
  //not function for reuse
  const updateItem = (e) => {
    e.preventDefault();
    if (values) {
      axios
        .post("http://localhost:8081/add", { title: values, userId: userId })
        .then((res) => {
          fetchUpdatedTasks(userId);
          setValues("");
        })
        .catch((err) => console.log(err));
    }

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
    removerFromTasks(id);
  };

  const removeCompletedItem = (id) => {
    axios
      .post("http://localhost:8081/completed_remove", { id: id })
      .then((res) => {
        fetchCompletedTasks(userId);
      })
      .catch((err) => {
        console.log(
          "error while fetching data after removing from uncompleted task",
          err
        );
      });
  };
  const moveToComplete = (id) => {
    axios
      .get("http://localhost:8081/uncompleted-single-task", {
        params: { id: id },
      })
      .then((res) => {
        const completed_data = res.data;

        axios
          .post("http://localhost:8081/complete", {
            id: completed_data[0].id,
            title: completed_data[0].title,
            user_id: completed_data[0].user_id,
            description: completed_data[0].description,
            created_date: `${new Date(
              completed_data[0].created_date
            ).getFullYear()}-${(
              new Date(completed_data[0].created_date).getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}-${new Date(
              completed_data[0].created_date
            ).getDate()}`,
            updated_date: `${new Date(
              completed_data[0].updated_date
            ).getFullYear()}-${(
              new Date(completed_data[0].updated_date).getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}-${new Date(
              completed_data[0].updated_date
            ).getDate()}`,
          })
          .then((response) => {
            removerFromTasks(id);
            fetchCompletedTasks(userId);
          })
          .catch((error) => console.log("reverst post error", error));
      })
      .catch((err) => console.log(err));
  };
  const revertItem = (id) => {
    axios
      .get("http://localhost:8081/single_task", { params: { id: id } })
      .then((res) => {
        const reverting_data = res.data;
        axios
          .post("http://localhost:8081/revert", {
            id: reverting_data[0].id,
            title: reverting_data[0].title,
            user_id: reverting_data[0].user_id,
            description: reverting_data[0].description,
            created_date: `${new Date(
              reverting_data[0].created_date
            ).getFullYear()}-${(
              new Date(reverting_data[0].created_date).getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}-${new Date(
              reverting_data[0].created_date
            ).getDate()}`,
            updated_date: `${new Date(
              reverting_data[0].updated_date
            ).getFullYear()}-${(
              new Date(reverting_data[0].updated_date).getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}-${new Date(
              reverting_data[0].updated_date
            ).getDate()}`,
          })
          .then((response) => {
            removeFromCompleted(id);
            fetchUpdatedTasks(userId);
          })
          .catch((error) => console.log("reverst post error", error));
      })
      .catch((err) => console.log(err));
  };
  const exportSummary = () => {
    let gistContent = `# Todo app
    ### Summary : 2/5 todos completed
    **Pending**
    `;
    tasks.forEach((item) => {
      gistContent += `<label> <input type='checkbox' /> ${item.title}
      </label>`;
    });
    gistContent += `**Completed**`;
    completed_tasks.forEach((item) => {
      gistContent += `<label> <input class="checked"   checked type='checkbox' /> ${item.title}
      </label>`;
    });
    gistContent += `<style>
    label{
        display: flex;
        align-items: center;
    }
    </style>
    `;
    // console.log(gistContent);
    axios
      .post("https://api.github.com/gists", {
        files: { "todo-summary.md": { content: gistContent } },
        public: false,
      })
      .then((response) => {
        const gist_id = response.data.id;
        const gist_url = `https://gist.github.com/${gist_id}`;
        console.log("Secret gist URL:", gist_url);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  {
    if (isloading) {
      return <p>loading...</p>;
    } else {
      return (
        <Container>
          <ToDoContainer>
            <Heading>ToDo List</Heading>

            <TopDiv>
              <Summary>
                Summary:{" "}
                <Span>
                  {completed_count}/{count + completed_count} todos completed
                </Span>
              </Summary>
              <SubHeading>Pending</SubHeading>
              <ToDoUl>
                {renderItem()}
                <ListForm>
                  <Input
                    type="text"
                    name="title"
                    placeholder="Type new task..."
                    value={values}
                    onChange={handleChange}
                  />
                  <Button onClick={updateItem}>Add New</Button>
                </ListForm>
              </ToDoUl>
            </TopDiv>
            <BottomDiv>
              <SubHeadingB>Completed</SubHeadingB>
              <ToDoUl>{renderCompletedItem()}</ToDoUl>
            </BottomDiv>
          </ToDoContainer>
          <ExportButton onClick={exportSummary}>Export Summary</ExportButton>
        </Container>
      );
    }
  }
}
export default HelloWorld;

const ExportButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 6px;
  color: #fff;
  background-color: #20c97b;
  cursor: pointer;
  position: fixed;
  bottom: 20px;
  right: 20px;
  border: none;
`;

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
const LinkTag = styled(Link)`
  width: 100%;
  color: #000;
  text-decoration: none;
  display: inline-block;

  &:hover {
    text-decoration: underline;
  }
`;
const CompletedLinkTag = styled(Link)`
  width: 100%;
  color: #20c97b;
  text-decoration: none;
  display: inline-block;

  &:hover {
    text-decoration: underline;
  }
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
const Summary = styled.h4`
  margin-bottom: 20px;
`;
const Span = styled.span`
  font-weight: 500;
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
