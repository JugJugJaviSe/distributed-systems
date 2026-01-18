from enum import Enum

class AttemptStatus(Enum):
    IN_PROGRESS = "in_progress"
    SUBMITTED = "submitted"
    PROCESSED = "processed"