package com.cg.service.deposit;

import com.cg.model.Deposit;
import com.cg.repository.DepositRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class DepositServiceImpl implements IDepositService {

    @Autowired
    private DepositRepository depositRepository;


    @Override
    public List<Deposit> findALl() {
        return null;
    }

    @Override
    public Optional<Deposit> findById(Long id) {
        return Optional.empty();
    }

    @Override
    public Deposit save(Deposit deposit) {
        return null;
    }

    @Override
    public void deledeById(Long id) {

    }

    @Override
    public void delete(Deposit deposit) {

    }
}