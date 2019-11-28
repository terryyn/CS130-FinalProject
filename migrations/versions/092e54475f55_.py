"""empty message

Revision ID: 092e54475f55
Revises: 708014887a6e
Create Date: 2019-11-28 06:11:45.866219

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '092e54475f55'
down_revision = '708014887a6e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('courses', sa.String(length=1024), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'courses')
    # ### end Alembic commands ###
