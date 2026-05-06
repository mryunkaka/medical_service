<?php

namespace App\Realtime\Contracts;

class EventNames
{
    public const HEARTBEAT = 'system.heartbeat';
    public const MEDICAL_RECORD_SAVED = 'medical-record.saved';
    public const MEDICAL_RECORD_DELETED = 'medical-record.deleted';
}
