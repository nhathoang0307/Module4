const page = {
    urls: {
        getAllCustomers: AppBase.DOMAIN_API + "/customers?deleted=0",
        findCustomerById: AppBase.DOMAIN_API + "/customers",
        createCustomer: AppBase.DOMAIN_API + "/customers",
        updateCustomerById: AppBase.DOMAIN_API + "/customers",
        deleteCustomerById: AppBase.DOMAIN_API + "/customers"
    },
    elements: {},
    loadData: {},
    commands: {}
}


let customers = [];
let currentCustomer = null;


page.elements.btnShowCreateModal = $('#btnShowCreateModal');
page.elements.modalCreate = $('#modalCreate');


page.loadData.getAllCustomers = () => {
    $.ajax({
        type: "GET",
        url: page.urls.getAllCustomers,
    })
    .done((data) => {
        $.each(data, (i, item) => {
            let str = renderCustomer(item);
            $('#tbCustomer tbody').prepend(str);
        })

        addEventCreateCustomer();
        addEventDeleteCustomer();
    })
    .fail((error) => {
        console.error(error);
    })
}


page.elements.btnShowCreateModal.on('click', () => {
    page.elements.modalCreate.modal('show');
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

let updateCustomerById = (obj) => {
    customers.filter(item => {
        if (item.id == obj.id) {
            item.fullName = obj.fullName;
            item.email = obj.email;
            item.phone = obj.phone;
            item.address = obj.address;
        }
    })
}

let addEventCreateCustomer = () => {
    $('.edit').on('click', function() {
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

let addEventDeleteCustomer = () => {
    $('.delete').on('click', function() {
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

page.commands.checkCustomerById = (id) => {
    return $.ajax({
        type: 'PATCH',
        url: page.urls.findCustomerById + '/' + id
    })
    .fail((error) => {
        console.log(error);
    })
}

page.commands.deleteCustomer = (id) => {
    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'PATCH',
        url: page.urls.deleteCustomerById + '/' + id,
        data: JSON.stringify({deleted: 1})
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

let removeEventCreateCustomer = () => {
    $('.edit').off('click');
}

let removeEventDeleteCustomer = () => {
    $('.delete').off('click');
}

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
        
        removeEventCreateCustomer();
        addEventCreateCustomer();

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

    // updateCustomerById(currentCustomer);

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

        removeEventCreateCustomer();
        addEventCreateCustomer();

        $('#modalUpdate').modal('hide');
    })
    .fail((error) => {
        alert('Update customer failed');
    })
    
})

let generateId = () => {
    return Math.random().toString(16).slice(13);
}

let renderCustomer = (item) => {
    return `
        <tr id="tr_${item.id}">
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
            </td>
            <td>
                <button class="btn btn-outline-success">
                    <i class="fas fa-plus"></i>
                </button>
            </td>
            <td>
            <button class="btn btn-outline-danger withdraw" data-id="${item.id}">
                <i class="fas fa-minus-circle"></i>
            </button>
            </td>
            <td>
                <button class="btn btn-outline-primary">
                    <i class="fas fa-exchange-alt"></i>
                </button>
            </td>
            <td>
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
            minlength: 'Min character of full name is ${0}',
            maxlength: 'Max character of full name is ${0}'
        },
        emailCre: {
            required: 'Email is required',
            minlength: 'Min character of email is ${0}',
            maxlength: 'Max character of email is ${0}'
        }
    },
    errorLabelContainer: "#modalCreate .modal-alert-danger",
    errorPlacement: function (error, element) {
        error.appendTo("#modalCreate .modal-alert-danger");
    },
    showErrors: function(errorMap, errorList) {
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


$(() => {
    page.loadData.getAllCustomers();
})
