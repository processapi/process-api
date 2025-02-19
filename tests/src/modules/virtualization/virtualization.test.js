import { VirtualizationModule } from "../../../../src/modules/virtualization.js";
import { SizesManager } from "../../../../src/modules/virtualization/sizes-manager.js";
import { assertEquals } from "jsr:@std/assert";

Deno.test("VirtualizationModule.get_sizes_manager - should return SizesManager instance with defaultSize and sizes", async () => {
    const sizesManager = await VirtualizationModule.get_sizes_manager({
        count: 10,
        defaultSize: 20
    });

    assertEquals(sizesManager instanceof SizesManager, true);
    assertEquals(sizesManager.length, 10);
    assertEquals(sizesManager.defaultSize, 20);
    assertEquals(sizesManager.totalSize, 200);
});

Deno.test("VirtualizationModule.get_sizes_manager - should return SizesManager instance with only count", async () => {
    const sizesManager = await VirtualizationModule.get_sizes_manager({
        count: 5,
    });

    assertEquals(sizesManager instanceof SizesManager, true);
    assertEquals(sizesManager.length, 5);
    assertEquals(sizesManager.defaultSize, 0);
    assertEquals(sizesManager.totalSize, 0);
});