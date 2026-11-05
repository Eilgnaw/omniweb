---
sidebar_position: 8
---

# Sharing, author info, and editing permissions

When you export a widget, you can include author details and a widget description. Turn on Share Protection only when you need to limit editing or redistribution.

## Author and widget information

The export sheet supports:

- Author name
- Website or social link
- Author bio
- Widget description

When an entry isn't valid, its message appears directly below that field. Fix it there before exporting.

Author details are attribution, not a verified real-world identity. Protected sharing can verify that a normal import hasn't changed the attribution or permission data, but it can't prove who the author really is.

After you finish the settings and tap Export, AWidget sends the `.omni` file to the iOS share sheet. From there, choose Save to Files, AirDrop, or another app that accepts shared files. AWidget no longer asks for a save location first.

Widget submissions use the same author, description, and Share Protection settings. The admin review page reads the author and permission data directly from the `.omni` v3 manifest. After approval, the package offered in Discover keeps those settings.

Every new `.omni` v3 file also contains an outer `preview.png` cover. The manifest records its filename, PNG dimensions, and SHA-256 as part of the integrity check. For submissions, the app uploads only the `.omni` file. The backend validates the package and extracts this cover instead of accepting a separate preview upload.

:::warning The cover is public
The outer cover isn't encrypted, even when Share Protection is on. This lets recipients and the submission backend show a preview before decrypting the widget content. Don't put account details, addresses, or other sensitive information in the cover.
:::

## View details from Home

When you tap a widget on Home, AWidget opens its information page instead of jumping straight into the editor. The page shows:

- Widget preview, type, description, and last update time
- Author name, bio, and website link
- Whether the widget came from protected sharing
- Component editing, code access, duplicate, and re-export permissions

Author information appears above the common actions. The page includes Edit, Duplicate, Export, Rename, and Delete buttons. Widgets without Share Protection also show Submit. Deletion requires confirmation, and a successful submission shows a HUD. Password-protected editing shows an Unlock Editing with Password action in the Editing Permissions card, and password verification happens there.

Swiping a widget in the Home list now shows Delete only and requires a second confirmation. Grid mode no longer has a long-press menu. Use the information page for editing, duplicating, exporting, renaming, and submitting.

If Component Editing still requires a password or the author denied it, tapping Edit still opens the normal preview editor, but the bottom component editor stays closed and the component list, layout properties, and code entry points remain unavailable. When the author provided user settings such as a city, color, or account, the app opens those settings automatically. After saving, the settings sheet closes and the preview immediately shows the latest result. With no user settings, the full preview appears directly. After a successful unlock, entering again enables the full editor.

Importing an `.omni` file, receiving one through the Share Extension, or downloading a widget from Discover opens the same information page first. Review the author, description, and permissions, then tap Edit to enter the editor.

## Unprotected sharing

Share Protection is off by default. When it's off, AWidget still uses the new `.omni` v3 container, but the payload isn't encrypted:

- Export doesn't require internet access.
- The recipient can edit, duplicate, and re-export normally.
- Author details travel with the file.
- The file contains the exporting app's build number.

:::warning Development-stage format
New AWidget versions export `.omni` v3 with an outer cover only, but file imports and the Share Extension can still restore direct-folder archives created by older app builds. Legacy packages have no signed author, password permissions, or app-build requirement, and import as fully editable legacy widgets. Development-stage protected v2 packages and early v3 packages without an outer cover aren't retained. Old Discover resources are additionally checked against their backend file hash.
:::

## App build requirement

Every export writes the current `CFBundleVersion` to the `appBuild` field in `manifest.json`.

- Import continues when the current app build is greater than or equal to the package's `appBuild`.
- If the package's `appBuild` is higher, AWidget rejects the import and asks the user to update the app first.
- This is the app build number, not the user-facing version number.

## Protected sharing

When Share Protection is on, you can configure these permissions separately:

| Permission | What it controls |
| --- | --- |
| Author info | Changing the author name, link, and bio |
| Component editing | Changing layout, component properties, resources, and the widget description |
| View and edit code | Viewing or changing JavaScript and Markup source |
| Duplicate widget | Making another copy inside the app |
| Re-export | Creating a new share file |

Each permission can be set to Allow, Password, or Deny. One password unlocks every password-protected permission in that share package. Source code isn't shown until code access is granted.

Runtime settings, local renaming, and deletion always remain available. For example, after the author locks layout and code, the recipient can still enter settings such as a city, color, or account.

The local MCP service follows the same permissions. Until access is unlocked, `get_widget` omits protected source and layout data, `update_widget` can't change JavaScript, Markup, component layout, or user-setting definitions, and `run_js` can't execute code with a protected widget ID. Creating widgets, syntax validation, and local renaming remain available.

:::warning The first import requires internet access
The first import of a protected `.omni` file must contact the Omni backend. The app verifies itself and the file, checks the import quota, and obtains decryption authorization. After a successful import, the widget can run offline. After one successful password check, that app installation can also edit the unlocked content offline.
:::

## Limiting imports

A share package can limit how many app installations receive authorization.

- Re-importing on the same device and app installation doesn't consume another slot.
- Reinstalling the app, moving to another device, or losing the App Attest key usually counts as a new installation.
- After the quota is full, new installations can't perform their first import. Previously authorized installations keep working.

The quota counts App Attest–verified app installations. It isn't a guaranteed count of unique physical devices.

## Security boundary

Protected sharing encrypts the widget content inside `.omni` and lets the backend verify file hashes, permissions, and the app installation. `manifest.json` and `preview.png` stay public, while layout, resources, and source code remain in the encrypted payload. The Share Protection backend stores only file keys and authorization data. The submission backend stores the received `.omni` file and its extracted public cover only when you actively submit a widget.

After import, AWidget keeps the content in its existing format inside the iOS app sandbox. This feature can't guarantee protection against jailbroken devices, runtime analysis, or plaintext extraction by a recipient who already received authorization.

Revoking a share package blocks new imports and unlocks. It can't remotely take back widgets that were already authorized for offline use.

