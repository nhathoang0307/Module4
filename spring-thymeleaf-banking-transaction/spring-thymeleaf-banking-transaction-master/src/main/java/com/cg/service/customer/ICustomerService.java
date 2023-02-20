package com.cg.service.customer;

import com.cg.model.Customer;
import com.cg.model.Deposit;
import com.cg.model.Transfer;
import com.cg.model.Withdraw;
import com.cg.service.IGeneralService;

import java.util.List;

public interface ICustomerService extends IGeneralService<Customer> {
    List<Customer> findAllByDeletedIsFalse();

    List<Customer> findAllByIdNotAndDeletedIsFalse(Long id);

    Deposit deposit(Deposit deposit);

    Withdraw withdraw(Withdraw withdraw);

    Transfer transfer(Transfer transfer);

}
