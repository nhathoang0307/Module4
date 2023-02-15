const page = {
    urls: {
        getAllCustomers: AppBase.DOMAIN_API + "/customers?deleted=0",
        findCustomerById: AppBase.DOMAIN_API + "/customers",
        createCustomer: AppBase.DOMAIN_API + "/customers",
        updateCustomerById: AppBase.DOMAIN_API + "/customers",
        deleteCustomerById: AppBase.DOMAIN_API + "/customers",
        getSelectRecipientsNE: AppBase.DOMAIN_API + "/customers?deleted=0&id_ne=",
        deposit: AppBase.DOMAIN_API + "/customers",
        withdraw: AppBase.DOMAIN_API + "/customers",
        Transfer: AppBase.DOMAIN_API + "/customers",
    },
    elements: {},
    loadData: {},
    commands: {}
}

let customers = [];
let currentCustomer = null;

let getAllCustomers = () => {
    console.log("getallcustomers");
    $.ajax({
        headers: {
            "accept": "application/json",
            "content-type": "application/json"
        },
        type: "GET",
        url: page.urls.getAllCustomers,
    })
        .done((data) => {
            $.each(data, (i, item) => {
                let str = renderCustomer(item);
                $('#tbCustomer tbody').prepend(str);
            })

            removeShowEditCustomer();
            showEditCustomer();
            removeShowDeleteCustomer();
            showDeleteCustomer();
            removeShowDeposit();
            showDeposit();
            removeShowWithdraw();
            showWithdraw();
            removeShowTransfer();
            showTransfer();
        })
        .fail((error) => {
            console.error(error);
        })
}


$('#btnShowCreateModal').on('click', () => {
    $('#modalCreate').modal('show');

})

let doCreateCustomer = () => {
    // let id = generateId();
    let fullName = $('#fullNameCre').val();
    let email = $('#emailCre').val();
    let phone = $('#phoneCre').val();
    let address = $('#addressCre').val();
    let balance = 0;
    let deleted = 0;

    let customer = new Customer();
    // customer.id = id;
    customer.fullName = fullName;
    customer.email = email;
    customer.phone = phone;
    customer.address = address;
    customer.balance = balance;
    customer.deleted = deleted;

    // customers.push(customer);

    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: "POST",
        url: page.urls.createCustomer,
        data: JSON.stringify(customer)
    })
        .done((data) => {
            customer = data;

            let str = renderCustomer(customer);
            $('#tbCustomer tbody').prepend(str);

            removeShowEditCustomer();
            showEditCustomer();
            removeShowDeleteCustomer();
            showDeleteCustomer();
            removeShowDeposit();
            showDeposit();
            removeShowWithdraw();
            showWithdraw();
            removeShowTransfer();
            showTransfer();
            removeShowTransfer();
            showTransfer();


            $('#modalCreate').modal('hide');

            AppBase.SweetAlert.showSuccessAlert('New customer is created successfully');
        })
        .fail((error) => {
            AppBase.SweetAlert.showErrorAlert('Create new customer failed');
        })
}

$('#btnCreateCustomer').on('click', () => {
    $('#frmCreateCustomer').trigger('submit');
})



page.loadData.findCustomerById = (id) => {
    return $.ajax({
        type: "GET",
        url: page.urls.findCustomerById + '/' + id
    })
        .fail((error) => {
            console.error(error);
        })
}

page.commands.checkCustomerById = (id) => {
    return $.ajax({
        type: 'PATCH',
        url: page.urls.findCustomerById + '/' + id
    })
        .fail((error) => {
            console.log(error);
        })
}





let showEditCustomer = () => {
    $('.edit').on('click', function () {
        let id = $(this).data('id');

        page.loadData.findCustomerById(id).then((customer) => {
            currentCustomer = customer;

            $('#fullNameUp').val(customer.fullName);
            $('#emailUp').val(customer.email);
            $('#phoneUp').val(customer.phone);
            $('#addressUp').val(customer.address);

            $('#modalUpdate').modal('show');

        })
            .catch(() => {
                alert('Customer not found');
            });
    })
}


let showDeleteCustomer = () => {
    $('.delete').on('click', function () {
        let id = $(this).data('id');
        AppBase.SweetAlert.showDeleteConfirmDialog().then(result => {
            if (result.isConfirmed) {
                page.commands.checkCustomerById(id).then(() => {
                    page.commands.deleteCustomer(id);
                })
                    .catch(() => {
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: 'Customer not found',
                        })
                    })
            }
        })
    })
}




let showDeposit = () => {
    $('.deposit').on('click', function () {
        let id = $(this).data('id');

        page.loadData.findCustomerById(id).then((dataCustomer) => {
            currentCustomer = dataCustomer;
            $('#fullNameDep').val(currentCustomer.fullName);
            $('#emailDep').val(currentCustomer.email);
            $('#BalanceDep').val(currentCustomer.balance);
            $('#AmountDep').val(0);
            $('#modalDeposit').modal('show');

        })
            .catch(() => {
                AppBase.SweetAlert.showErrorAlert('Customer not found');
            });
    })
}

let showWithdraw = () => {
    $('.withdraw').on('click', function () {
        let id = $(this).data('id');

        page.loadData.findCustomerById(id).then((customer) => {
            currentCustomer = customer;

            $('#fullNameWith').val(customer.fullName);
            $('#emailWith').val(customer.email);
            $('#phoneWith').val(customer.phone);
            $('#addressWith').val(customer.address);
            $('#balanceWith').val(currentCustomer.balance);
            $('#AmountWith').val(0);
            $('#modalWithdraw').modal('show');
        })
            .catch(() => {
                alert('Customer not found');
            });
    })
}

let showTransfer = () => {
    $('.transfer').on('click', function () {
        let id = $(this).data('id');

        page.loadData.findCustomerById(id).then((customer) => {
            currentCustomer = customer;

            $('#senderFullNameTrans').val(customer.fullName);
            $('#senderEmailTrans').val(customer.email);
            $('#senderBalanceTrans').val(currentCustomer.balance);
            $('#AmountTrans').val(0);
            getSelectRecipientsNE(id);
            $('#modalTransfer').modal('show');
        })
            .catch(() => {
                alert('Customer not found');
            });
    })
}

let getSelectRecipientsNE = (senderId) => {
    $('#selectRecipientsTransfer').empty();
    $.ajax({
        headers: {
            "accept": "application/json",
            "content-type": "application/json"
        },
        type: "GET",
        url: page.urls.getSelectRecipientsNE + senderId
    })
        .done((data) => {
            $.each(data, (i, item) => {
                $('#selectRecipientsTransfer').append($('<option>',
                    {
                        value: item.id,
                        text: item.id + " - " + item.fullName
                    }));
            })

        })
        .fail((error) => {
            console.log(error);
        })
}




let removeShowEditCustomer = () => {
    $('.edit').off('click');
}

let removeShowDeleteCustomer = () => {
    $('.delete').off('click');
}

let removeShowDeposit = () => {
    $('.deposit').off('click');
}

let removeShowWithdraw = () => {
    $('.withdraw').off('click');
}

let removeShowTransfer = () => {
    $('.transfer').off('click');
}


let updateCustomerById = (obj) => {
    customers.filter(item => {
        if (item.id == obj.id) {
            item.fullName = obj.fullName;
            item.email = obj.email;
            item.phone = obj.phone;
            item.address = obj.address;
            item.addClass = obj.address;
        }
    })
}

$('#btnUpdateCustomer').on('click', () => {
    let id = currentCustomer.id;
    let fullName = $('#fullNameUp').val();
    let email = $('#emailUp').val();
    let phone = $('#phoneUp').val();
    let address = $('#addressUp').val();

    currentCustomer.fullName = fullName;
    currentCustomer.email = email;
    currentCustomer.phone = phone;
    currentCustomer.address = address;

    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'PATCH',
        url: page.urls.updateCustomerById + '/' + id,
        data: JSON.stringify(currentCustomer)
    })
        .done((data) => {
            currentCustomer = data;

            let newRow = renderCustomer(currentCustomer);
            let currentRow = $('#tr_' + id);

            currentRow.replaceWith(newRow);

            removeShowEditCustomer();
            showEditCustomer();
            removeShowDeleteCustomer();
            showDeleteCustomer();
            removeShowDeposit();
            showDeposit();
            removeShowWithdraw();
            showWithdraw();
            removeShowTransfer();
            showTransfer();

            $('#modalUpdate').modal('hide');
        })
        .fail((error) => {
            alert('Update customer failed');
        })
})

page.commands.deleteCustomer = (id) => {
    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'PATCH',
        url: page.urls.deleteCustomerById + '/' + id,
        data: JSON.stringify({ deleted: 1 })
    })
        .done(() => {

            $('#tr_' + id).remove();

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Customer has been deleted.',
                showConfirmButton: false,
                timer: 2000
            })
        })
        .fail(() => {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Failed to delete customer',
            })
        })
}

$('#btnDeposit').on('click', () => {
    $('#frmDeposit').trigger('submit');
})


let doDeposit = () => {
    let id = currentCustomer.id;
    let balanceNew = +($('#AmountDep').val());
    let balanceOld = +(currentCustomer.balance);
    currentCustomer.balance = balanceOld + balanceNew;
    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'PATCH',
        url: page.urls.deposit + '/' + id,
        data: JSON.stringify(currentCustomer)
    })
        .done((data) => {

            currentCustomer = data;

            let newRow = renderCustomer(currentCustomer);
            let currentRow = $('#tr_' + id);

            currentRow.replaceWith(newRow);


            removeShowEditCustomer();
            showEditCustomer();
            removeShowDeleteCustomer();
            showDeleteCustomer();
            removeShowDeposit();
            showDeposit();
            removeShowWithdraw();
            showWithdraw();
            removeShowTransfer();
            showTransfer();

            $('#modalDeposit').modal('hide');
        })
        .fail((error) => {
            alert('Deposit failed');
        })
}


$('#btnWithdrawCustomer').on('click', () => {
    let id = currentCustomer.id;
    let AmountWith = +($('#AmountWith').val());
    let balanceOld = +(currentCustomer.balance);
    currentCustomer.balance = balanceOld - AmountWith;


    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'PATCH',
        url: page.urls.withdraw + '/' + id,
        data: JSON.stringify(currentCustomer)
    })
        .done((data) => {
            currentCustomer = data;

            let newRow = renderCustomer(currentCustomer);
            let currentRow = $('#tr_' + id);

            currentRow.replaceWith(newRow);


            removeShowEditCustomer();
            showEditCustomer();
            removeShowDeleteCustomer();
            showDeleteCustomer();
            removeShowDeposit();
            showDeposit();
            removeShowWithdraw();
            showWithdraw();
            removeShowTransfer();
            showTransfer();

            $('#modalWithdraw').modal('hide');
        })
        .fail((error) => {
            alert('Deposit failed');
        })
})

// $('#btnTransfer').on('click', () => {
//     let id = currentCustomer.id;
//     let transactionAmount = ($('#transferAmountTrans').val());
//     let fee = ($('#feeTrans').val());
//     let transactionAmountTrans = +transactionAmount+ +transactionAmount*(+fee/100);
//     let senderbalanceOld = currentCustomer.balance;
//     currentCustomer.balance = +senderbalanceOld - transactionAmountTrans;

//     $.ajax({
//         headers: {
//             'accept': 'application/json',
//             'content-type': 'application/json'
//         },
//         type: 'PATCH',
//         url: page.urls.Transfer + '/' + id,
//         data: JSON.stringify(currentCustomer)
//     })
//         .done((data) => {
//             currentCustomer = data;

//             let newRow = renderCustomer(currentCustomer);
//             let currentRow = $('#tr_' + id);

//             currentRow.replaceWith(newRow);


//             removeShowEditCustomer();
//             showEditCustomer();
//             removeShowDeleteCustomer();
//             showDeleteCustomer();
//             removeShowDeposit();
//             showDeposit();
//             removeShowWithdraw();
//             showWithdraw();
//             removeShowTransfer();
//             showTransfer();

//             $('#modalTransfer').modal('hide');
//         })
//         .fail((error) => {
//             alert('Transfer failed');
//         })
// })

$('#btnTransfer').on('click', () => {
    let id = currentCustomer.id;
    let transactionAmount = ($('#transferAmountTrans').val());
    let fee = ($('#feeTrans').val());
    let transactionAmountTrans = +transactionAmount + +transactionAmount * (+fee / 100);
    let senderbalanceOld = currentCustomer.balance;
    currentCustomer.balance = +senderbalanceOld - transactionAmountTrans;

    let recipientId = $('#selectRecipientsTransfer').val();
    let RecipientCustomer = new Customer();
    console.log("recipientId " + recipientId);

    page.loadData.findCustomerById(recipientId).then((data) => {
        RecipientCustomer = data;
        console.log("RecipientCustomer.id: " + RecipientCustomer.id);
        console.log(RecipientCustomer);
        RecipientCustomer.balance = +RecipientCustomer.balance + +transactionAmount;
        let transfer = { currentCustomer, RecipientCustomer }

        $.ajax({
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            type: 'PATCH',
            url: page.urls.Transfer + '/' + id,
            data: JSON.stringify(transfer)
        })
            .done((data) => {

                sender = data.currentCustomer;

                let newRowsender = renderCustomer(sender);
                let currentRowsender = $('#tr_' + sender.id);

                currentRowsender.replaceWith(newRowsender);

                Recipient = data.RecipientCustomer;

                let newRowRecipient = renderCustomer(Recipient);
                let currentRowRecipient = $('#tr_' + Recipient.id);

                currentRowRecipient.replaceWith(newRowRecipient);

                $.ajax({
                    headers: {
                        'accept': 'application/json',
                        'content-type': 'application/json'
                    },
                    type: 'PATCH',
                    url: page.urls.Transfer + '/' + sender.id,
                    data: JSON.stringify(sender)
                })
                $.ajax({
                    headers: {
                        'accept': 'application/json',
                        'content-type': 'application/json'
                    },
                    type: 'PATCH',
                    url: page.urls.Transfer + '/' + Recipient.id,
                    data: JSON.stringify(Recipient)
                })


                removeShowEditCustomer();
                showEditCustomer();
                removeShowDeleteCustomer();
                showDeleteCustomer();
                removeShowDeposit();
                showDeposit();
                removeShowWithdraw();
                showWithdraw();
                removeShowTransfer();
                showTransfer();

                $('#modalTransfer').modal('hide');
            })
            .fail((error) => {
                alert('Transfer failed');
            })

    })



})




let generateId = () => {
    return Math.random().toString(16).slice(13);
}

let renderCustomer = (item) => {
    return `
        <tr id="tr_${item.id}" style="text-align: center;" >
            <td>${item.id}</td>
            <td>${item.fullName}</td>
            <td>${item.email}</td>
            <td>${item.phone}</td>
            <td>${item.balance}</td>
            <td>${item.address}</td>
            <td>
                <button class="btn btn-outline-secondary edit" data-id="${item.id}">
                    <i class="far fa-edit"></i>
                </button>
                <button class="btn btn-outline-success deposit" data-id="${item.id}">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="btn btn-outline-danger withdraw" data-id="${item.id}">
                    <i class="fas fa-minus-circle"></i>
                </button>
                <button class="btn btn-outline-success transfer" data-id="${item.id}">
                    <i class="fas fa-exchange-alt"></i>
                </button>
                <button class="btn btn-outline-danger delete" data-id="${item.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>
    `;
}


$('#modalCreate').on('hidden.bs.modal', () => {
    $('#frmCreateCustomer')[0].reset();
    $('#frmCreateCustomer').validate().resetForm();

    $('#modalCreate .modal-alert-danger').empty().removeClass("show").addClass("hide");
    $('#frmCreateCustomer').find("input.error").removeClass("error");
})

$('#frmCreateCustomer').validate({
    rules: {
        fullNameCre: {
            required: true,
            minlength: 5,
            maxlength: 20
        },
        emailCre: {
            required: true,
            minlength: 5,
            maxlength: 40
        }
    },
    messages: {
        fullNameCre: {
            required: 'Full name is required',
            minlength: 'Min character of full name is ${5}',
            maxlength: 'Max character of full name is ${20}'
        },
        emailCre: {
            required: 'Email is required',
            minlength: 'Min character of email is ${5}',
            maxlength: 'Max character of email is ${40}'
        }
    },

    errorLabelContainer: "#modalCreate .modal-alert-danger",
    errorPlacement: function (error, element) {
        error.appendTo("#modalCreate .modal-alert-danger");
    },
    showErrors: function (errorMap, errorList) {
    console.log("validate Create");
        if (this.numberOfInvalids() > 0) {
            $("#modalCreate .modal-alert-danger").removeClass("hide").addClass("show");
        } else {
            $("#modalCreate .modal-alert-danger").removeClass("show").addClass("hide").empty();
            $("#frmCreateCustomer input.error").removeClass("error");
        }
        this.defaultShowErrors();
    },
    submitHandler: function () {
        doCreateCustomer();
    }
});


$('#frmDeposit').validate({
    rules: {
        AmountDep: {
            required: true,
            number: true,
            min: 1000,
            max: 1000000
        }
    },
    messages: {
        AmountDep: {
            required: 'Transaction amount is required',
            number: 'Transaction amount must be number',
            min: 'Transaction amount must be more than ${0}',
            max: 'Transaction amount must be less than ${0}'
        }
    },
    errorLabelContainer: "#modalDeposit .modal-alert-danger",
    errorPlacement: function (error, element) {
        error.appendTo("#modalDeposit .modal-alert-danger");
    },
    showErrors: function(errorMap, errorList) {
        if (this.numberOfInvalids() > 0) {
            $("#modalDeposit .modal-alert-danger").removeClass("hide").addClass("show");
        } else {
            $("#modalDeposit .modal-alert-danger").removeClass("show").addClass("hide").empty();
            $("#frmDeposit input.error").removeClass("error");
        }
        this.defaultShowErrors();
    },
    submitHandler: function () {
        doDeposit();
    }
});

$(() => {
    getAllCustomers();
})