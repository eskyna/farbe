from pathlib import Path


def before_all(context):
    context.project_root = Path(__file__).resolve().parents[1]
    context.dist_dir = context.project_root / "dist"
    context.support_dir = context.project_root / "features" / "support"
    context.color_story_reports = None

