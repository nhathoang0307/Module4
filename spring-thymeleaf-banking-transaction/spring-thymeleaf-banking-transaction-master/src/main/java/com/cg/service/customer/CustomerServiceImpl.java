package com.cg.service.customer;

import com.cg.model.Customer;
import com.cg.model.Deposit;
import com.cg.model.Transfer;
import com.cg.model.Withdraw;
import com.cg.repository.CustomerRepository;
import com.cg.repository.DepositRepository;
import com.cg.repository.TransferRepository;
import com.cg.repository.WithdrawRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@Service
@Transactional
public class CustomerServiceImpl implements ICustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private DepositRepository depositRepository;

    @Autowired
    private WithdrawRepository withdrawRepository;

    @Autowired
    private TransferRepository transferRepository;

    @Override
    public List<Customer> findALl() {
        return customerRepository.findAll();
    }

    @Override
    public List<Customer> findAllByDeletedIsFalse() {
        return customerRepository.findAllByDeletedIsFalse();
    }

    @Override
    public Optional<Customer> findById(Long id) {
        return customerRepository.findById(id);
    }

    @Override
    public Customer save(Customer customer) {
        return customerRepository.save(customer);
    }

    @Override
    public void deledeById(Long id) {
        customerRepository.deleteById(id);
    }

    @Override
    public void delete(Customer customer) {
         customerRepository.delete(customer);
    }

    @Override
    public Deposit deposit(Deposit deposit) {
        Customer customer = deposit.getCustomer();
//        BigDecimal currentBalance = customer.getBalance();
        BigDecimal transactionAmount = deposit.getTransactionAmount();
//        BigDecimal newBalance = currentBalance.add(transactionAmount);
//        customer.setBalance(newBalance);
        customerRepository.incrementBalance(customer.getId(), transactionAmount);

        deposit.setId(null);
        deposit.setCreatedAt(new Date());
        depositRepository.save(deposit);

        customer = customerRepository.findById(customer.getId()).get();
        deposit.setCustomer(customer);

        return deposit;
    }

    @Override
    public Withdraw withdraw(Withdraw withdraw) {
        Customer customer = withdraw.getCustomer();
        BigDecimal transactionAmount = withdraw.getTransactionAmount();
        customerRepository.decrementBalance(customer.getId(), transactionAmount);
        withdraw.setId(null);
        withdraw.setCreatedAt(new Date());
        withdrawRepository.save(withdraw);
        customer = customerRepository.findById(customer.getId()).get();
        withdraw.setCustomer(customer);
        return withdraw;
    }

    @Override
    public List<Customer> findAllByIdNotAndDeletedIsFalse(Long id) {
        return customerRepository.findAllByIdNotAndDeletedIsFalse(id);
    }

    @Override
    public Transfer transfer(Transfer transfer) {
        BigDecimal transferAmount = transfer.getTransferAmount();
        BigDecimal transactionAmount = transfer.getTransactionAmount();

        customerRepository.decrementBalance(transfer.getSender().getId(), transactionAmount);

        customerRepository.incrementBalance(transfer.getRecipient().getId(), transferAmount);

        transferRepository.save(transfer);

        Customer sender = customerRepository.findById(transfer.getSender().getId()).get();
        transfer.setSender(sender);

        return transfer;
    }
}
