#!/usr/bin/env python3
# Packs scripts/ into a JavaScript Injector config file, in filename order.
# python3 tools/build_injector_xml.py > Jellyfin.Plugin.JavaScriptInjector.xml
# Stop Jellyfin, copy it to <data dir>/plugins/configurations/, start Jellyfin.
import glob, os, sys
from xml.sax.saxutils import escape

HERE = os.path.dirname(os.path.abspath(__file__))
SCRIPTS = os.path.join(HERE, "..", "scripts")

DISABLED = {'04_MQ-Font-Loader'}
AUTH = {'15_MQ-MUI-Nav-Active', '21_MQ-DirecTV-Guide', '22_MQ-Billboards', '30_MQ-Netflix-Sans', '31_MQ-UI-Polish'}

entries = []
for path in sorted(glob.glob(os.path.join(SCRIPTS, "*.js"))):
    stem = os.path.basename(path)[:-3]
    name = stem.split("_", 1)[1]
    with open(path, encoding="utf-8") as f:
        body = f.read()
    entries.append(
        "    <CustomJavaScriptEntry>\n"
        f"      <Name>{escape(name)}</Name>\n"
        f"      <Script>{escape(body)}</Script>\n"
        f"      <Enabled>{'false' if stem in DISABLED else 'true'}</Enabled>\n"
        f"      <RequiresAuthentication>{'true' if stem in AUTH else 'false'}</RequiresAuthentication>\n"
        "    </CustomJavaScriptEntry>\n"
    )

sys.stdout.write(
    '<?xml version="1.0" encoding="utf-8"?>\n'
    '<PluginConfiguration xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '
    'xmlns:xsd="http://www.w3.org/2001/XMLSchema">\n'
    "  <CustomJavaScripts>\n" + "".join(entries) + "  </CustomJavaScripts>\n</PluginConfiguration>\n"
)
