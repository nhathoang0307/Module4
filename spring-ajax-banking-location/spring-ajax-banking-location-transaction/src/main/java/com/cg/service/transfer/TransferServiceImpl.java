package com.cg.service.transfer;

import com.cg.model.Transfer;
import com.cg.repository.TransferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TransferServiceImpl implements ITransferService {
    @Autowired
    private TransferRepository transferRepository;

    @Override
    public List<Transfer> findALl() {
        return transferRepository.findAll();
    }

    @Override
    public BigDecimal getSumFeesAmount() {
        return transferRepository.getSumFeesAmount();
    }
    @Override
    public Optional<Transfer> findById(Long id) {
        return Optional.empty();
    }

    @Override
    public Transfer save(Transfer transfer) {
        return null;
    }

    @Override
    public void deledeById(Long id) {

    }

    @Override
    public void delete(Transfer transfer) {
    }
}
