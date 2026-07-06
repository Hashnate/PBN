import 'package:flutter/material.dart';
import 'package:pbn/core/constants/app_colors.dart';

class AnimatedPbnLogo extends StatefulWidget {
  final double size;
  const AnimatedPbnLogo({super.key, this.size = 180});

  @override
  State<AnimatedPbnLogo> createState() => _AnimatedPbnLogoState();
}

class _AnimatedPbnLogoState extends State<AnimatedPbnLogo> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  
  // Outer components P and N
  late Animation<double> _pOpacity;
  late Animation<double> _nOpacity;
  late Animation<Offset> _pSlide;
  late Animation<Offset> _nSlide;
  
  // Handshake component
  late Animation<double> _handshakeScale;
  late Animation<double> _handshakeOpacity;

  // Middle component B
  late Animation<double> _bScale;
  late Animation<double> _bGlow;
  late Animation<double> _bOpacity;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2200), // Slightly longer for the extra sequence step
    );

    // 1. P and N Fade in (0.0 to 0.35)
    _pOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.0, 0.35, curve: Curves.easeIn)),
    );
    _nOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.0, 0.35, curve: Curves.easeIn)),
    );

    // 2. Handshake Scales and Fades in the middle (0.15 to 0.70)
    _handshakeScale = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.15, 0.40, curve: Curves.easeOutBack)),
    );
    _handshakeOpacity = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween<double>(begin: 0.0, end: 1.0),
        weight: 40, // Fade in
      ),
      TweenSequenceItem(
        tween: ConstantTween<double>(1.0),
        weight: 20, // Hold
      ),
      TweenSequenceItem(
        tween: Tween<double>(begin: 1.0, end: 0.0),
        weight: 40, // Fade out
      ),
    ]).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.15, 0.70, curve: Curves.easeInOut)),
    );

    // 3. B Scales and Glows in the middle (0.50 to 0.80)
    _bScale = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.50, 0.80, curve: Curves.elasticOut)),
    );
    _bOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.50, 0.70, curve: Curves.easeIn)),
    );
    _bGlow = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.65, 0.95, curve: Curves.easeInOut)),
    );

    // 4. P and N slide together to close the gap (0.75 to 1.0)
    _pSlide = Tween<Offset>(begin: const Offset(-0.35, 0), end: Offset.zero).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.75, 1.0, curve: Curves.easeInOutBack)),
    );
    _nSlide = Tween<Offset>(begin: const Offset(0.35, 0), end: Offset.zero).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.75, 1.0, curve: Curves.easeInOutBack)),
    );

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const double fontSize = 72;
    const TextStyle letterStyle = TextStyle(
      fontSize: fontSize,
      fontWeight: FontWeight.w900,
      color: Colors.white,
      fontFamily: 'Montserrat', // Falling back to system sans-serif if not found
      letterSpacing: -2,
    );

    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return SizedBox(
          width: widget.size,
          height: widget.size,
          child: Center(
            child: Row(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // P
                Transform.translate(
                  offset: _pSlide.value * 80,
                  child: Opacity(
                    opacity: _pOpacity.value,
                    child: const Text('P', style: letterStyle),
                  ),
                ),
                
                // B (Center)
                SizedBox(
                  width: fontSize * 0.7, // Width of B
                  child: Center(
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        // B Text
                        Transform.scale(
                          scale: _bScale.value,
                          child: Opacity(
                            opacity: _bOpacity.value,
                            child: Text(
                              'B', 
                              style: letterStyle.copyWith(
                                color: AppColors.accent,
                                shadows: [
                                  Shadow(
                                    color: AppColors.accent.withValues(alpha: 0.6 * _bGlow.value),
                                    blurRadius: 20 * _bGlow.value,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),

                        // Handshake Icon
                        Transform.translate(
                          offset: const Offset(-4, 2), // Horizontal shift of -4px to center it perfectly between P and N, and vertical shift of 2px for baseline alignment
                          child: Transform.scale(
                            scale: _handshakeScale.value,
                            child: Opacity(
                              opacity: _handshakeOpacity.value,
                              child: Icon(
                                Icons.handshake,
                                size: fontSize * 0.85,
                                color: AppColors.accent,
                                shadows: [
                                  Shadow(
                                    color: AppColors.accent.withValues(alpha: 0.4 * _handshakeOpacity.value),
                                    blurRadius: 15,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // N
                Transform.translate(
                  offset: _nSlide.value * 80,
                  child: Opacity(
                    opacity: _nOpacity.value,
                    child: const Text('N', style: letterStyle),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
