import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pbn/core/providers/auth_provider.dart';
import 'package:pbn/core/providers/club_provider.dart';
import 'package:pbn/core/providers/member_provider.dart';
import 'package:pbn/core/providers/notification_provider.dart';

/// Riverpod providers that manage the existing ChangeNotifier instances.
/// These are used to bridge Riverpod with the existing Provider MultiProvider tree.

final authRiverpodProvider = ChangeNotifierProvider<AuthProvider>((ref) {
  return AuthProvider();
});

final clubRiverpodProvider = ChangeNotifierProvider<ClubProvider>((ref) {
  return ClubProvider();
});

final memberRiverpodProvider = ChangeNotifierProvider<MemberProvider>((ref) {
  return MemberProvider();
});

final notificationRiverpodProvider = ChangeNotifierProvider<NotificationProvider>((ref) {
  return NotificationProvider();
});

extension RiverpodContext on BuildContext {
  T read<T>(ProviderListenable<T> provider) {
    return ProviderScope.containerOf(this, listen: false).read(provider);
  }
}
