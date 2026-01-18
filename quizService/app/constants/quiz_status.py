from enum import Enum

class QuizStatus(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"