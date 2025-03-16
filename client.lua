local isUsingTablet = false
local tabletProp = nil

-- Tablet öffnen
RegisterCommand('+openTablet', function()
    if not isUsingTablet then
        isUsingTablet = true
        SetNuiFocus(true, true)
        playTabletAnimation()
        SendNUIMessage({ action = 'opentablet' })
    end
end, false)

-- Keybind für das Tablet
RegisterKeyMapping('+openTablet', 'Open Tablet', 'keyboard', 'F5')

-- NUI Callback für Tablet-Aktionen
RegisterNUICallback('tablet', function(data, cb)
    local backMessage = "Tablet konnte nichts machen"

    if data.action == "closeTablet" and isUsingTablet then
        stopTabletAnimation()
        SetNuiFocus(false, false)
        isUsingTablet = false
        backMessage = "Tablet erfolgreich geschlossen"
    end

    cb({ message = backMessage })
end)

-- Tablet-Animation starten
function playTabletAnimation()
    local playerPed = PlayerPedId()

    -- Animation nur laden, wenn sie nicht existiert
    local animDict = "amb@code_human_in_bus_passenger_idles@female@tablet@idle_a"
    if not HasAnimDictLoaded(animDict) then
        RequestAnimDict(animDict)
        while not HasAnimDictLoaded(animDict) do
            Wait(50) -- Kleinere Wartezeit für bessere Performance
        end
    end

    -- Animation abspielen
    TaskPlayAnim(playerPed, animDict, "idle_a", 8.0, 8.0, -1, 49, 0, false, false, false)

    -- Falls das Tablet bereits existiert, erst entfernen
    if tabletProp and DoesEntityExist(tabletProp) then
        DeleteEntity(tabletProp)
    end

    -- Neues Tablet erstellen und an Handknochen anfügen
    tabletProp = CreateObject(GetHashKey("prop_cs_tablet"), 0, 0, 0, true, true, false)
    AttachEntityToEntity(tabletProp, playerPed, GetPedBoneIndex(playerPed, 28422), -0.05, 0.0, 0.0, 0.0, 0.0, 0.0, true, true, false, true, 1, true)
end

-- Tablet-Animation stoppen
function stopTabletAnimation()
    local ped = PlayerPedId()

    -- Animation stoppen
    ClearPedTasks(ped)
    ClearPedSecondaryTask(ped) -- Verhindert Animationen, die "hängenbleiben"

    -- Tablet sicher entfernen
    if tabletProp and DoesEntityExist(tabletProp) then
        DeleteEntity(tabletProp)
        tabletProp = nil
    end
end