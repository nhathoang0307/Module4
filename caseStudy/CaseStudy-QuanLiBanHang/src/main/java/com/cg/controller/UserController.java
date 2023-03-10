package com.cg.controller;

import com.cg.model.Customer;
import com.cg.model.Deposit;
import com.cg.model.Transfer;
import com.cg.model.Withdraw;
import com.cg.model.dto.TransferRequestDTO;
import com.cg.service.customer.ICustomerService;
import com.cg.service.deposit.IDepositService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;


@Controller
@RequestMapping("/customers")
public class UserController {

    @Autowired
    private ICustomerService customerService;

    @Autowired
    private IDepositService depositService;


    @GetMapping
    public String showListPage(Model model) {

        List<Customer> customers = customerService.findAllByDeletedIsFalse();

        model.addAttribute("customers", customers);

        return "admin/user/list";
    }


    @GetMapping("/create")
    public String showCreatePage(Model model) {
        model.addAttribute("customer", new Customer());

        return "admin/user/create";
    }

//    @PostMapping("/create")
//    public String doCreate(@ModelAttribute Customer customer, BindingResult bindingResult, Model model) {
//
//        new Customer().validate(customer, bindingResult);
//
//        if (bindingResult.hasFieldErrors()) {
//            model.addAttribute("customer", customer);
//            model.addAttribute("error", true);
//            return "customer/create";
//        }
//
//        customer.setBalance(BigDecimal.ZERO);
//        customerService.save(customer);
//        model.addAttribute("success", true);
//
//        model.addAttribute("messages", "Create customer success");
//        return "customer/create";
//    }

    @GetMapping("/update/{id}")
    public String showUpdatePage(@PathVariable Long id, Model model) {

        Optional<Customer> customerOptional = customerService.findById(id);

        if (!customerOptional.isPresent()) {
            model.addAttribute("error", true);
        } else {
            Customer customer = customerOptional.get();
            model.addAttribute("customer", customer);
        }
        return "admin/user/update";
    }


    @PostMapping("/update/{id}")
    public String doUpdate(@PathVariable Long id, @ModelAttribute Customer customer, Model model) {

        Optional<Customer> customerOptional = customerService.findById(id);

        if (!customerOptional.isPresent()) {
            model.addAttribute("error", true);
        } else {
            customer.setId(id);
            customerService.save(customer);
            model.addAttribute("messageSuccess", "Update customer success");
            model.addAttribute("customer", customer);
        }
        return "admin/user/update";
    }

//    @GetMapping("/delete/{id}")
//    public String showDeletePage(@PathVariable Long id, Model model) {
//        Optional<Customer> customerOptional = customerService.findById(id);
//        if (!customerOptional.isPresent()) {
//            model.addAttribute("error", true);
//            List<Customer> customers = customerService.findAllByDeletedIsFalse();
//            model.addAttribute("customers", customers);
//            return "customer/list";
//        } else {
//            Customer customer = customerOptional.get();
//            model.addAttribute("customer", customer);
//            return "customer/delete";
//        }
//    }

//    @PostMapping("/delete/{id}")
//    public String showDeletePage(@PathVariable Long id, @ModelAttribute Customer customer, Model model) {
//
//        Optional<Customer> customerOptional = customerService.findById(id);
//
//        if (!customerOptional.isPresent()) {
//            model.addAttribute("error", true);
//        } else {
//            customer.setId(id);
//            customerService.delete(customer);
//            model.addAttribute("messageSuccess", "Delete customer success");
//            List<Customer> customers = customerService.findAllByDeletedIsFalse();
//            model.addAttribute("customers", customers);
//        }
//        return "customer/list";
//    }

    @GetMapping("deposit/{id}")
    public String showDeposit(@PathVariable Long id, Model model) {

        Optional<Customer> customerOptional = customerService.findById(id);

        if (!customerOptional.isPresent()) {
            model.addAttribute("error", true);
            model.addAttribute("messages", "Customer not found");
        } else {
            Customer customer = customerOptional.get();
//            model.addAttribute("customer", customer);
            Deposit deposit = new Deposit();
            deposit.setCustomer(customer);

            model.addAttribute("deposit", deposit);
        }
        return "admin/user/deposit";
    }

    @PostMapping("/deposit/{customerId}")
    public String doDeposit(@PathVariable Long customerId, @ModelAttribute Deposit deposit, Model model) {

        Optional<Customer> customerOptional = customerService.findById(customerId);

        if (!customerOptional.isPresent()) {
            model.addAttribute("error", true);
            model.addAttribute("messages", "Customer not found");
        } else {
            Customer customer = customerOptional.get();

            deposit.setCustomer(customer);
            deposit = customerService.deposit(deposit);

            deposit.setTransactionAmount(BigDecimal.ZERO);

            model.addAttribute("deposit", deposit);
        }

        model.addAttribute("success", true);
        model.addAttribute("messageSuccess", "Deposit successful");
        return "admin/user/deposit";
    }

    @GetMapping("withdraw/{id}")
    public String showWithdraw(@PathVariable Long id, Model model) {

        Optional<Customer> customerOptional = customerService.findById(id);

        if (!customerOptional.isPresent()) {
            model.addAttribute("error", true);
            model.addAttribute("messages", "Customer not found");
        } else {
            Customer customer = customerOptional.get();
            Withdraw withdraw = new Withdraw();
            withdraw.setCustomer(customer);
            model.addAttribute("withdraw", withdraw);

        }
        return "admin/user/withdraw";
    }

    @PostMapping("/withdraw/{customerId}")
    public String doWithdraw(@PathVariable Long customerId, @ModelAttribute Withdraw withdraw, Model model) {

        Optional<Customer> customerOptional = customerService.findById(customerId);

        if (!customerOptional.isPresent()) {
            model.addAttribute("error", true);
        } else {
            Customer customer = customerOptional.get();
            BigDecimal balance = customer.getBalance();
            BigDecimal withdrawTransactionAmount = withdraw.getTransactionAmount();
            if (withdrawTransactionAmount.compareTo(balance) > 0) {
                model.addAttribute("error", true);
                model.addAttribute("messages", "insufficient balance");
            } else if (withdrawTransactionAmount.compareTo(new BigDecimal(100000)) < 0) {
                model.addAttribute("error", true);
                model.addAttribute("messages", "withdrawal amount is not less than 100000");
            } else if (withdrawTransactionAmount.compareTo(new BigDecimal(1000000000)) > 0) {
                model.addAttribute("error", true);
                model.addAttribute("messages", "withdrawal amount is not more than 1000000000");
            } else {
                withdraw.setCustomer(customer);
                withdraw = customerService.withdraw(withdraw);
                withdraw.setTransactionAmount(BigDecimal.ZERO);
                model.addAttribute("withdraw", withdraw);
                model.addAttribute("success", true);
                model.addAttribute("messages", "Withdraw successful");
            }
        }
        return "admin/user/withdraw";
    }

    @GetMapping("transfer/{senderId}")
    public String showTransfer(@PathVariable Long senderId, Model model) {

        Optional<Customer> senderOptional = customerService.findById(senderId);

        if (!senderOptional.isPresent()) {
            model.addAttribute("errorSenderID", true);
            model.addAttribute("messages", "Customer not found");
            return "customer/transfer";
        }
        else {
            Customer sender = senderOptional.get();

            TransferRequestDTO transferDTO = new TransferRequestDTO();
            transferDTO.setSender(sender);

            model.addAttribute("transferDTO", transferDTO);

            List<Customer> recipients = customerService.findAllByIdNotAndDeletedIsFalse(senderId);

            model.addAttribute("recipients", recipients);
        }
        return "admin/user/transfer";
    }

    @PostMapping("/transfer/{customerSenderId}")
    public String doTransfer(@PathVariable Long customerSenderId, @ModelAttribute TransferRequestDTO transferRequestDTO, BindingResult bindingResult, Model model) {

// l???y id ng?????i g???i
//        l???y id ng?????i nh???n
//        check s??? ti???n ng???i g???i
//        l???y s??? ti???n g???i
//        l???y fee
//        tr??? blance c???a ng?????i ng?????i
//        c???ng blance ng?????i nh???n
        // l??u v??o transfer

        // validate
        new TransferRequestDTO().validate(transferRequestDTO, bindingResult);

        //t??m id ng?????i g???i
        Optional<Customer> senderOptional = customerService.findById(customerSenderId);

        // l???y l???i list ng?????i nh???n truy???n ra l???i
        List<Customer> recipients = customerService.findAllByIdNotAndDeletedIsFalse(customerSenderId);
        model.addAttribute("recipients", recipients);
        model.addAttribute("transferDTO", transferRequestDTO);

        // n??m l???i truy???n v??o
        if (bindingResult.hasFieldErrors()) {
            model.addAttribute("error", true);
            return "admin/user/transfer";
        }

        // n??m l???i kh??ng t??m th???y id ng?????i g???i
        if (!senderOptional.isPresent()) {
            model.addAttribute("errorSenderID", true);
            model.addAttribute("messages", "Customer not found");
            return "admin/user/transfer";
        }

        //check id ng?????i nh???n
        Long recipientId = transferRequestDTO.getRecipient().getId();
        Optional<Customer> recipientOptional = customerService.findById(recipientId);
        if (!recipientOptional.isPresent()) {
            model.addAttribute("errorControl", true);
            model.addAttribute("messages", "Recipient not valid");
            return "admin/user/transfer";
        }
        if (customerSenderId.equals(recipientId)) {
            model.addAttribute("errorControl", true);
            model.addAttribute("messages", "Sender ID must be different from Recipient ID");
            return "admin/user/transfer";
        }

        //check s??? ti???n ng?????i g???i

        //s??? ti???n hi???n c?? c???a ng?????i g???i
        BigDecimal senderCurrentBalance = senderOptional.get().getBalance();

        //s??? ti???n c???n chuy???n String
        String transferAmountStr = transferRequestDTO.getTransferAmount();

        //s??? ti???n c???n chuy???n BigDecimal
        BigDecimal transferAmount = BigDecimal.valueOf(Long.parseLong(transferAmountStr));

        //% ph??
        long fees = 10L;

        //s??? ti???n ph??
        BigDecimal feesAmount = transferAmount.multiply(BigDecimal.valueOf(fees)).divide(BigDecimal.valueOf(100));

        //t???ng s??? ti???n g???i + ph??
        BigDecimal transactionAmount = transferAmount.add(feesAmount);

        if (senderCurrentBalance.compareTo(transactionAmount) < 0) {
            model.addAttribute("errorControl", true);
            model.addAttribute("messages", "Sender balance not enough to transfer");
            return "admin/user/transfer";
        }

        // set l???i transfer
        Transfer transfer = new Transfer();
        transfer.setSender(senderOptional.get());
        transfer.setRecipient(recipientOptional.get());
        transfer.setTransferAmount(transferAmount);
        transfer.setFees(fees);
        transfer.setFeesAmount(feesAmount);
        transfer.setTransactionAmount(transactionAmount);

        // l??u v??o database
        customerService.transfer(transfer);

        //set l???i transferRequestDTO ????? truy???n ra ngo??i
        transferRequestDTO.setSender(transfer.getSender());
        transferRequestDTO.setTransferAmount(null);
        transferRequestDTO.setTransactionAmount(null);
        model.addAttribute("transferDTO", transferRequestDTO);
        model.addAttribute("success", true);
        model.addAttribute("messages", "Transfer success");
        return "admin/user/transfer";

    }
}