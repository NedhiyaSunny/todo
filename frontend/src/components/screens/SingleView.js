import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

function EditTodo() {
  const { itemId } = useParams();
  const { status } = useParams();
  const [userId, setUserId] = useState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createdDate, setCreatedDate] = useState(new Date());
  const [updatedDate, setUpdatedDate] = useState(new Date());
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    let api = "";
    console.log("new", status);
    if (status == 0) {
      api = "http://localhost:8081/single";
    } else if (status == 1) {
      api = "http://localhost:8081/completed_single";
    }
    axios
      .post(api, { itemId })
      .then((res) => {
        setUserId(res.data[0].user_id);
        setTitle(res.data[0].title);
        setDescription(res.data[0].description);
        // setCreatedDate(new Date(res.data[0].created_date));
        setCreatedDate(
          `${new Date(res.data[0].created_date).getFullYear()}-${(
            new Date(res.data[0].created_date).getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${new Date(res.data[0].created_date).getDate()}`
        );
        setUpdatedDate(
          `${new Date(res.data[0].updated_date).getFullYear()}-${(
            new Date(res.data[0].updated_date).getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${new Date(res.data[0].updated_date).getDate()}`
        );
        // JSON.parse is usud to convert string to boolean
        setCompleted(JSON.parse(res.data[0].is_completed));
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    console.log("created_date", createdDate);
  }, [createdDate]);
  const handleDelete = (itemId) => {
    let api = "";
    if (status == 0) {
      api = "http://localhost:8081/remove";
    } else {
      api = "http://localhost:8081/completed_remove";
    }
    axios
      .post(api, { id: itemId })
      .then((res) => {
        navigate("/home");
      })
      .catch((err) => {
        console.log(
          "error while fetching data after removing from uncompleted task",
          err
        );
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let api = "";
    if (status == 0) {
      api = "http://localhost:8081/update";
    } else {
      api = "http://localhost:8081/update-completed";
    }
    axios
      .post(api, {
        id: itemId,
        title: title,
        description: description,
      })
      .then((response) => {
        navigate("/home");
      })
      .catch((error) => console.log("reverst post error", error));
    const updatedTodo = {
      title,
      description,
      createdDate,
      updatedDate,
      completed,
    };
    console.log(updatedTodo);
  };

  return (
    <div>
      <H1>Edit Todo</H1>

      <Form onSubmit={handleSubmit}>
        <Label>
          Title:
          <Input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              console.log(title);
            }}
          />
        </Label>
        <Label>
          Description:
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Label>
        <Label>
          Created Date:
          <Input
            type="date"
            disabled
            value={createdDate}
            onChange={(e) => setCreatedDate(e.target.value)}
          />
        </Label>
        <Label>
          Updated Date:
          <Input
            type="date"
            disabled
            value={updatedDate}
            onChange={(e) => setUpdatedDate(e.target.value)}
          />
        </Label>
        <LabelCheckbox>
          Status:
          <Checkbox
            type="checkbox"
            disabled
            checked={completed}
            onChange={(e) => {
              setCompleted(e.target.checked);
            }}
          />
        </LabelCheckbox>
        <Div>
          <Button type="button" onClick={() => handleDelete(itemId)}>
            Delete
          </Button>
          <SubmitButton type="submit">Update</SubmitButton>
        </Div>
      </Form>
    </div>
  );
}

export default EditTodo;

const H1 = styled.h1`
  text-align: center;
  margin-bottom: 50px;
`;
const Form = styled.form`
  max-width: 400px;
  margin: 0 auto;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
const LabelCheckbox = styled(Label)`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;
const Checkbox = styled.input`
  margin-left: auto;
  width: 120px;
  height: 30px;
  position: relative;
  appearance: none;
  border: 2px solid #151a58;
  border-radius: 4px;
  cursor: pointer;

  &:checked {
    background-color: #151a58;
    border-color: #151a58;
  }

  &::before {
    content: "Pending";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #151a58;
    font-size: 12px;
    font-weight: bold;
  }
  &:checked::before {
    content: "Completed";
    color: white;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #151a58;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #1c2165;
  }
`;

const SubmitButton = styled(Button)`
  margin-left: 20px;
`;
const Div = styled.div`
  display: block;
  display: flex;
  justify-content: right;
`;
