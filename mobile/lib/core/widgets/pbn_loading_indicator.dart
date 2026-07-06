import 'package:flutter/material.dart';
import 'dart:math' as math;
import 'package:pbn/core/constants/app_colors.dart';

class PbnLoadingIndicator extends StatefulWidget {
  final double size;
  final Color? baseColor;
  final List<Color>? gradientColors;

  const PbnLoadingIndicator({
    super.key,
    this.size = 36,
    this.baseColor,
    this.gradientColors,
  });

  @override
  State<PbnLoadingIndicator> createState() => _PbnLoadingIndicatorState();
}

class _PbnLoadingIndicatorState extends State<PbnLoadingIndicator> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final resolvedBase = widget.baseColor ?? AppColors.primary.withValues(alpha: 0.1);
    final resolvedGradient = widget.gradientColors ?? AppColors.goldGradient;

    return RotationTransition(
      turns: _controller,
      child: SizedBox(
        width: widget.size,
        height: widget.size,
        child: CustomPaint(
          painter: _PbnLoadingPainter(
            baseColor: resolvedBase,
            gradientColors: resolvedGradient,
          ),
        ),
      ),
    );
  }
}

class _PbnLoadingPainter extends CustomPainter {
  final Color baseColor;
  final List<Color> gradientColors;

  _PbnLoadingPainter({
    required this.baseColor,
    required this.gradientColors,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final double strokeWidth = size.width * 0.12;
    final Rect rect = Offset.zero & size;
    
    final Paint basePaint = Paint()
      ..color = baseColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;

    final Paint activePaint = Paint()
      ..shader = SweepGradient(
        colors: [
          gradientColors.first.withValues(alpha: 0.0),
          ...gradientColors,
        ],
      ).createShader(rect)
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeWidth = strokeWidth;

    canvas.drawCircle(size.center(Offset.zero), (size.width - strokeWidth) / 2, basePaint);
    canvas.drawArc(
      Rect.fromCircle(center: size.center(Offset.zero), radius: (size.width - strokeWidth) / 2),
      -math.pi / 2,
      math.pi * 1.5,
      false,
      activePaint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
