<?php

namespace App\Exceptions;

use RuntimeException;

class BusinessRuleException extends RuntimeException
{
    public function __construct(
        string $message,
        protected int $status = 422,
        protected array $errors = [],
        protected string $toastType = 'error',
    ) {
        parent::__construct($message, $status);
    }

    public function getStatus(): int
    {
        return $this->status;
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function getToastType(): string
    {
        return $this->toastType;
    }
}
