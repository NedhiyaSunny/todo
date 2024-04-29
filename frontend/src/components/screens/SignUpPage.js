import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignupPage = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    axios
      .post("http://localhost:8081/signup", {
        name: name,
        email: email,
        password: password,
      })
      .then((response) => {
        if (response.data) {
          setError("");
          console.log("registered", response.data.insertId);
          localStorage.setItem("user_id", response.data.insertId);
          navigate("/home");
        } else {
          setError("Email is already Registered");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  return (
    <Body>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Heading>Create an Account</Heading>
          <InputGroup>
            <Label htmlFor="name">Username:</Label>
            <Input
              required
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Label htmlFor="email">Email:</Label>
            <Input
              required
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Label htmlFor="password">Password:</Label>
            <Input
              required
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit">Sign Up</Button>
            <P>{error}</P>
          </InputGroup>
          <AlreadyMember>
            Already have an account? <StyledLink to="/">Log in</StyledLink>
          </AlreadyMember>
        </Form>
      </Container>
    </Body>
  );
};

export default SignupPage;

const Body = styled.body`
  background-color: #f0f0f0;
`;
const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Form = styled.form`
  max-width: 400px;
  background-color: #fff;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  padding: 40px;
  box-sizing: border-box;
`;

const Heading = styled.h2`
  text-align: center;
  margin: 19px 0 30px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;
const P = styled.p`
  color: red;
  text-align: center;
`;
const Input = styled.input`
  padding: 10px;
  margin-bottom: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;
const Label = styled.label`
  margin-bottom: 10px;
  font-size: 16px;
  color: #666;
`;
const Button = styled.button`
  padding: 10px;
  margin-top: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #0056b3;
  }
`;

const AlreadyMember = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const StyledLink = styled(Link)`
  color: #007bff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
