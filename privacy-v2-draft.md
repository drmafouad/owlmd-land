# Privacy Policy

**Last Updated:** [DATE]

## Summary

We believe your documents belong to you. OwlMD is an **offline-first** application.

- No personal data collection
- No user accounts required
- No tracking or analytics
- Files stay on your device unless you choose to share, export or back them up

## Information We Do NOT Collect

OwlMD does **NOT** collect, store on our servers, or transmit to us:

- Personal information (name, email, etc.)
- User accounts or credentials
- Location data
- Usage statistics or analytics
- Your fingerprints or biometric data

## Data Stored Locally

The following data stays on your device and is never sent to our servers:

### 1. Documents, folders and tags

Your Markdown notes, folders and tags are stored in a database (SQLite) in the app's private storage on your device. Deleted notes stay in Trash for 7 days and are then removed permanently.

### 2. Images

When you add a photo from your gallery or take one with your camera, OwlMD copies it into the app's private storage. The copy is re-encoded and resized (long edge up to 2048 px). Re-encoding removes hidden photo metadata, including camera details and GPS location. The original photo in your gallery is never changed.

### 3. PDF files

PDFs you export are saved in the app's private storage. When you share a PDF, it goes to the app you pick in your device's share menu.

### 4. App preferences and search history

Theme selection, PDF settings, app lock setting and your recent searches are stored on your device. Search history never leaves your device.

### 5. Device ID

On first launch OwlMD creates a random identifier (a UUID) and keeps it in your device's secure storage. It is stored with your notes and settings on your device and is included in backup files you create. It is not linked to you, and the app never sends it anywhere.

## Backup and Restore

You can save a backup of your notes as a zip file. You choose where the file is saved. OwlMD never uploads your backup. To restore, you pick a backup file from your device.

## App Lock

If you turn on App Lock, OwlMD asks Android to verify you with your fingerprint or your device PIN, pattern or password. Android handles this check. OwlMD only receives a pass or fail result. It never sees or stores your fingerprint, PIN, pattern or password.

## Network Requests

The app only connects to the internet for:

- **Announcements:** Checking for app updates and news by downloading a public JSON file from GitHub (`raw.githubusercontent.com`), at most once every 24 hours, or when you pull to refresh. The request carries no information about you or your documents.
- **GitHub Import (Optional):** If you choose to load a Markdown file from a GitHub link you provide.
- **External Images:** Downloading images that your document refers to by web address, when you export a PDF.
- **Links you tap:** Opening a web link in your browser, including the Google Play page when an update notice asks you to update.

Like any internet request, the server you contact (for example GitHub) can see your IP address. OwlMD does not add your device ID, name or any identifier to these requests.

## Share and Open

OwlMD can receive Markdown and text files that you share to it from another app, or open with it from a file manager. These files are read on your device and are not sent anywhere.

## Importing from OwlMD 1

If you used the earlier version of OwlMD on the same device, OwlMD 2 can import your notes from the older version's files stored on your device. This happens on your device only.

## Third-Party Services

OwlMD does **NOT** use:

- Analytics services (No Firebase, No Google Analytics)
- Crash reporting tools
- Advertising networks

## Contact Us

If you have any questions, please contact us:

**Email:** support@injazapps.com

The "Report a bug", "Request a feature" and "Get help" options in the app open a pre-filled email in your own mail app. Nothing is sent until you press send in that app, and the app attaches no logs or documents.

<!--
EVIDENCE LIST (hidden). Repo: drmafouad/owlmd_v2 @ 5cecd825. Paths relative to the repo root.

Summary / No collection
- No analytics, crash, ads or billing package: pubspec.yaml (dependencies list; grep for firebase|sentry|crashlytics|analytics|admob|purchases = none).
- INTERNET + ACCESS_NETWORK_STATE are the only permissions in the main manifest: android/app/src/main/AndroidManifest.xml:4-5. Plugin-added permissions NOT verified (needs merged manifest, see report).
- Contact is mailto only, no app-side network call: lib/features/settings/domain/contact_email.dart:1-8.

Fingerprints never seen
- authenticate() returns a result only; biometricOnly:false (OS prompt incl. device PIN/pattern/password): lib/features/lock/data/local_auth_gateway_impl.dart:5-9, :28-30.

Documents, folders, tags, Trash
- SQLite via drift: lib/core/database/database.dart:3-7.
- Trash purge after 7 days: lib/core/database/purge_cutoff.dart:18; lib/features/documents/data/drift_document_repository.dart:425-431.

Images
- Gallery and camera pick: lib/features/editor/data/image_picker_gateway_impl.dart:40, :45; re-encode at pick time (imageQuality) :13-21, :54; 4096 px bound :36.
- Copied into app-private images/ dir, source never modified: lib/features/editor/data/app_image_store.dart:16-21, :32-34.
- Decode + re-encode strips EXIF/GPS; long edge 2048: lib/features/editor/data/app_image_store.dart:49-61, :73, :78, :96-100.

PDF files
- Exports saved in app documents dir /exports: lib/features/pdf_export/data/pdf_exports_directory.dart:11-13; lib/features/pdf_export/data/pdf_exporter_impl.dart:94-101.
- Shared through the system share sheet: lib/features/pdf_export/presentation/pdf_export_action.dart:51-53.

Preferences / search history
- Search history stored in the local settings table: lib/features/search/data/settings_search_history_store.dart:9-20.
- App lock setting stored locally: lib/features/lock/data/settings_app_lock_store.dart:23-54.
- PDF theme stored locally: lib/features/pdf_export/presentation/pdf_theme_preference.dart:51-65.

Device ID
- Random UUID v7 created on first launch, kept in flutter_secure_storage: lib/core/database/device_id.dart:26-30, :43-56, :64-66; ADR docs/adr/0024-device-id-uuid-v7.md.
- Read once at startup and provided to the app: lib/main.dart:76, :86.
- Written into local database rows (examples): lib/features/folders/data/drift_folder_repository.dart:162; lib/features/lock/data/settings_app_lock_store.dart:37; lib/features/pdf_export/presentation/pdf_theme_preference.dart:65; lib/features/editor/presentation/editor_screen.dart:444.
- Written into backup manifest: lib/features/backup/data/backup_v3_writer.dart:177 (manifest.json lists deviceId, :46).
- NOT in any network call: the only network call sites are fetch_announcements_gateway_impl.dart:34, fetch_from_github_impl.dart:37, pdf_image_loader.dart:49-53 and url_launcher launches; none takes a deviceId parameter or sets headers (see WEB-03 report, step 2).

Backup and restore
- Archive format v3 (manifest.json, images/<sha256>.<ext>): lib/features/backup/data/backup_v3_writer.dart:46-50, :96.
- Saved through Android Storage Access Framework ACTION_CREATE_DOCUMENT (user picks the location): lib/features/backup/data/backup_archive_save_gateway_impl.dart:10-25; android/app/src/main/kotlin/com/injazapps/owlmd/MainActivity.kt:79 (backup_save channel).
- Restore picks a file with the file picker: lib/features/backup/data/backup_file_gateway_impl.dart:22.
- No network code in lib/features/backup/ (grep for http|HttpClient in that folder = none).

Network
- Announcements URL: lib/features/announcements/data/announcement_feed_url.dart:9 (raw.githubusercontent.com/drmafouad/owlmd-announcements/.../announcements-v2.json).
- Plain GET, no custom headers, 8 s timeout: lib/features/announcements/data/fetch_announcements_gateway_impl.dart:13, :34.
- At most once per 24 h unless the user pulls to refresh: lib/features/announcements/presentation/announcements_controller.dart:20, :109-117.
- App version is used locally to filter items, not sent: announcements_controller.dart:100-105.
- GitHub import (https only, github.com or raw.githubusercontent.com, user-initiated from the documents menu): lib/features/github_import/domain/github_url.dart:12-13, :35; lib/features/github_import/data/fetch_from_github_impl.dart:37; lib/features/documents/presentation/documents_more_actions.dart:48-49.
- External images downloaded during PDF export (http/https GET): lib/features/pdf_export/data/pdf_image_loader.dart:15-18, :49-53.
- Google Play page opened from the update notice via url_launcher: lib/features/announcements/presentation/update_notice_host.dart:133-141.
- Tapped links in documents open outside the app: lib/features/editor/presentation/preview_pane.dart:425.
- Announcement links limited to an allowlist: lib/features/announcements/domain/announcement_link_policy.dart (play.google.com, apps.apple.com, github.com/drmafouad).

Share and open
- SEND / SEND_MULTIPLE / VIEW intent filters for text/plain, text/markdown, text/x-markdown, application/octet-stream and .md files: android/app/src/main/AndroidManifest.xml:35-148.
- Shared/opened file is read through the content resolver on-device: android/app/src/main/kotlin/com/injazapps/owlmd/MainActivity.kt:422-437.

Import from OwlMD 1
- Reads v1's SharedPreferences key file_history and v1 files in the shared app documents folder: lib/features/migration/data/shared_preferences_v1_source.dart:34-39; lib/features/migration/data/file_system_sources.dart:8-12.

Support contact
- support@injazapps.com, subject/body templates only, opened with url_launcher: lib/features/settings/domain/contact_email.dart:10-56; lib/features/settings/data/url_launcher_contact_gateway.dart:10; lib/features/settings/presentation/contact_settings_tiles.dart (three tiles).
- No logs or documents attached: body strings are fixed templates, contact_email.dart:16-49.
-->
