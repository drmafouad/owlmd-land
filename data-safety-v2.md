# Google Play Data safety: OwlMD 2 (draft answers)

Derived from the code evidence in `privacy-v2-draft.md` (repo `drmafouad/owlmd_v2` @ 5cecd825).
Play's definition: **"collected" = data transmitted off the device by the app.** Data that is only processed or stored on the device is not collected. Nothing here is submitted; the owner enters the answers in Play Console.

## Top-level questions

| Question | Answer | Evidence |
|---|---|---|
| Does the app collect or share any of the required user data types? | **No** | No upload code exists. The only network calls are plain GETs (announcements feed, GitHub import, PDF images) and link launches: `fetch_announcements_gateway_impl.dart:34`, `fetch_from_github_impl.dart:37`, `pdf_image_loader.dart:49-53`, `update_notice_host.dart:133` |
| Is all collected data encrypted in transit? | Not asked when nothing is collected | Note: `pdf_image_loader.dart:15-18` accepts `http://` image URLs the user wrote in a document. This would matter only if images counted as collection. |
| Do you provide a way to request data deletion? | Not asked when nothing is collected | |
| Account creation | None | ADR 0004 (`docs/adr/0004-local-only-no-accounts.md`) |

## Category by category

| Play category | Collected? | Shared? | Required / optional | Purpose | Reasoning |
|---|---|---|---|---|---|
| Location (approximate / precise) | No | No | n/a | n/a | No location permission or code. Photo GPS metadata is stripped on import (`app_image_store.dart:49-55`). |
| Personal info (name, email, address, user IDs, etc.) | No | No | n/a | n/a | No accounts. Support email is sent by the user from their own mail app (`contact_email.dart:1-8`), not by the app. |
| Financial info | No | No | n/a | n/a | No billing package in `pubspec.yaml`. |
| Health and fitness | No | No | n/a | n/a | None. |
| Messages (emails, SMS, other) | No | No | n/a | n/a | Mail is composed in the user's own mail app. |
| Photos and videos | No | No | n/a | n/a | Gallery/camera images are copied into app-private storage and never uploaded (`image_picker_gateway_impl.dart:40,45`; `app_image_store.dart:16-34`). |
| Audio files | No | No | n/a | n/a | None. |
| Files and docs | No | No | n/a | n/a | Notes, PDFs and backups stay on the device or go where the user sends them (`backup_archive_save_gateway_impl.dart:10-25`, `pdf_export_action.dart:51`). |
| Calendar / Contacts | No | No | n/a | n/a | None. |
| App activity (interactions, search history, installed apps, other content) | No | No | n/a | n/a | Search history is stored locally only (`settings_search_history_store.dart:9-20`). |
| Web browsing | No | No | n/a | n/a | Tapped links open in the browser (`preview_pane.dart:425`); the app records nothing. |
| App info and performance (crash logs, diagnostics) | No | No | n/a | n/a | No crash or analytics SDK (`pubspec.yaml`). |
| Device or other IDs | No | No | n/a | n/a | A random device ID exists but never leaves the device, except inside backup files the user saves (`device_id.dart:26-66`; `backup_v3_writer.dart:177`). Needs the owner to confirm the call-site audit in the WEB-03 report. |

## Other Data safety items

| Item | Answer |
|---|---|
| Data handled by the app but not collected | Local notes, images, PDFs, search history, device ID, app lock setting (all on-device) |
| Biometrics | Not accessed. The OS prompt returns pass/fail only (`local_auth_gateway_impl.dart:5-9,28-30`). |
| Independent security review | No |
| Data deletion | n/a (nothing collected). Users delete data by deleting notes or clearing app data. |

## Differences from what v1 likely declared

I cannot see v1's Play Console form. The v1 privacy page said "no data collection, no analytics, no crash reporting, no accounts", so v1 most likely declared **"No data collected / No data shared."** v2 keeps the same answers. Items that look different but do not change the answers:

1. **New local features in v2:** device ID, SQLite database, camera/gallery import, backup zip, app lock. All stay on the device, so they are not "collected".
2. **Announcements feed:** v1's policy already listed it (public JSON on GitHub). v2 uses a separate file (`announcements-v2.json`) and sends no identifiers.
3. **Camera:** the app uses the system camera/picker through `image_picker`; no CAMERA permission is declared in the main manifest (`AndroidManifest.xml:4-5`). Plugin-added permissions are still unverified (merged manifest, see the report).

## Open questions for the owner (not answered by code alone)

- **Android Auto Backup:** the manifest does not set `android:allowBackup`, and there are no backup rules files (`grep` over `android/` found none). Android's default is to allow Google's device backup, which can copy app data (including the database) to the user's own Google account. Decide whether to set `android:allowBackup="false"` or add rules, and whether the policy should mention it.
- **HTTP image URLs:** decide whether PDF export should refuse plain `http://` image URLs.
- **IP address:** GitHub's servers see the user's IP when the announcements feed or GitHub import is fetched. Play's form treats this as not "collected by the app" when no user data is sent, but confirm this reading with Play's current help text before submitting.
- **Merged manifest:** confirm no extra plugin permissions before final answers (command in the WEB-03 report).
