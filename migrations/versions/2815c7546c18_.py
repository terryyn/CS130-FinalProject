"""empty message

Revision ID: 2815c7546c18
Revises: f40943a6d424
Create Date: 2019-11-28 09:06:43.734535

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2815c7546c18'
down_revision = 'f40943a6d424'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('events', sa.Column('guests', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('events', 'guests')
    # ### end Alembic commands ###
