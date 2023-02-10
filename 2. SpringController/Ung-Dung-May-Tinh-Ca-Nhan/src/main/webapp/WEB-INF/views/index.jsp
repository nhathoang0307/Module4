<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<html>
<head>

</head>
<body>
<h2>CALCULATOR</h2>
<form action="/result" method="post">
    <input type="number" name="number1" value="${number1}">
    <input type="number" name="number2" value="${number2}">
    <button type="submit" name="calculation" value="add">Addition(+)</button>
    <button type="submit" name="calculation" value="sub">Subtraction(-)</button>
    <button type="submit" name="calculation" value="mul">Multiplication(X)</button>
    <button type="submit" name="calculation" value="div">Division(/)</button>
</form>

<h2>result: ${result}</h2>



</body>
</html>