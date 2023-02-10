<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<html>
<head>

</head>
<body>
<h2>CALCULATOR</h2>
<form action="/result" method="post">
    <input type="number" name="input1" value="">
    <input type="number" name="input2" value="">
    <button type="submit" value="add">Addition(+)</button>
    <button type="submit" value="sub">Subtraction(-)</button>
    <button type="submit" value="mul">Multiplication(X)</button>
    <button type="submit" value="div">Division(/)</button>
</form>

<h2>result: ${result}</h2>



</body>
</html>