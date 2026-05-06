<?php

namespace App\Models;

use Illuminate\Contracts\Support\Arrayable;

class LegacyUser implements Arrayable
{
    public function __construct(
        public readonly int $id,
        public readonly string $fullName,
        public readonly string $role,
        public readonly string $position,
        public readonly string $division,
        public readonly string $unitCode,
        public readonly bool $canViewAllUnits,
    ) {
    }

    public static function fromRow(object|array $row): self
    {
        $data = (array) $row;

        return new self(
            id: (int) ($data['id'] ?? 0),
            fullName: (string) ($data['full_name'] ?? $data['name'] ?? ''),
            role: (string) ($data['role'] ?? ''),
            position: (string) ($data['position'] ?? ''),
            division: (string) ($data['division'] ?? ''),
            unitCode: (string) ($data['unit_code'] ?? 'roxwood'),
            canViewAllUnits: (int) ($data['can_view_all_units'] ?? 0) === 1,
        );
    }

    public static function fromSession(array $data): self
    {
        return new self(
            id: (int) ($data['id'] ?? 0),
            fullName: (string) ($data['full_name'] ?? ''),
            role: (string) ($data['role'] ?? ''),
            position: (string) ($data['position'] ?? ''),
            division: (string) ($data['division'] ?? ''),
            unitCode: (string) ($data['unit_code'] ?? 'roxwood'),
            canViewAllUnits: (bool) ($data['can_view_all_units'] ?? false),
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->fullName,
            'role' => $this->role,
            'position' => $this->position,
            'division' => $this->division,
            'unit_code' => $this->unitCode,
            'can_view_all_units' => $this->canViewAllUnits,
        ];
    }
}
