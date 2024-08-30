"""fixed syntax error with first_lase_name to first_last_name

Revision ID: c8c3b993b79b
Revises: a0828ed3d4cb
Create Date: 2024-08-28 21:11:34.159329

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c8c3b993b79b'
down_revision = 'a0828ed3d4cb'
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
