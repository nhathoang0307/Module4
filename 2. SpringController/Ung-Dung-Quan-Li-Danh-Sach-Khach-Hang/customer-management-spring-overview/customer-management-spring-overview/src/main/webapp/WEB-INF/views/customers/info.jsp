<%@ page import="cg.wbd.grandemonstration.service.CustomerService" %>
<%@ page import="cg.wbd.grandemonstration.service.CustomerServiceFactory" %>
<%@ page import="cg.wbd.grandemonstration.model.Customer" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri = "http://java.sun.com/jsp/jstl/core" prefix = "c" %>
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Customer Information</title>
</head>
<body>
<form action="/customers" method="post" th:object="${customer}">
    <fieldset>
        <legend>Customer Information</legend>
        <input type="hidden" name="id" th:placeholder="${customer.id}"  >
        <table>
            <tr>
                <td>Id</td>
                <td th:placeholder="${customer.id}"></td>
            </tr>
            <tr>
                <td>Name</td>
                <td>
                    <input type="text" name="name" th:placeholder="${customer.name}">
                </td>
            </tr>
            <tr>
                <td>Email</td>
                <td>
                    <input type="text" name="email" th:placeholder="${customer.email}">
                </td>
            </tr>
            <tr>
                <td>Address</td>
                <td>
                    <input type="text" name="address" th:placeholder="${customer.address}">
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <input type="submit" value="Update">
                </td>
            </tr>
        </table>
    </fieldset>
</form>
<a href="/customers">Back to list</a>.
</body>
</html>