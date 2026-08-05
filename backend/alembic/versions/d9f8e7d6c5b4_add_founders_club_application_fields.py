"""add application_type and custom_industry to applications

Adds:
  - application_type: 'standard' or 'founders_club' (defaults to 'standard')
  - custom_industry: text field for company industry (optional)
  - industry_category_id: alter to nullable so Founders Club applications don't require an industry category ID

Revision ID: d9f8e7d6c5b4
Revises: b2641d403673
Create Date: 2026-07-30 12:30:00.000000
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "d9f8e7d6c5b4"
down_revision: Union[str, None] = "b2641d403673"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "applications",
        sa.Column("application_type", sa.String(length=30), nullable=False, server_default="standard")
    )
    op.add_column(
        "applications",
        sa.Column("custom_industry", sa.String(length=150), nullable=True)
    )
    op.alter_column(
        "applications",
        "industry_category_id",
        existing_type=postgresql.UUID(as_uuid=True),
        nullable=True
    )


def downgrade() -> None:
    op.alter_column(
        "applications",
        "industry_category_id",
        existing_type=postgresql.UUID(as_uuid=True),
        nullable=False
    )
    op.drop_column("applications", "custom_industry")
    op.drop_column("applications", "application_type")
